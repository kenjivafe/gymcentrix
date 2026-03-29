# rfid-hook.ps1
# Captures global keyboard input and outputs RFID scans to stdout.
# Node.js agent reads this via child_process pipe — no native binary needed.

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.Text;
using System.Diagnostics;

public class GlobalKeyHook : IMessageFilter {
    private const int WH_KEYBOARD_LL = 13;
    private const int WM_KEYDOWN = 0x0100;
    private static IntPtr _hookID = IntPtr.Zero;
    private static LowLevelKeyboardProc _proc = HookCallback;
    private static StringBuilder _buffer = new StringBuilder();
    private static long _lastKeyTime = 0;
    private const int RFID_TIMEOUT_MS = 500;
    private const int RFID_LENGTH = 10;

    public delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr GetModuleHandle(string lpModuleName);

    [StructLayout(LayoutKind.Sequential)]
    private struct KBDLLHOOKSTRUCT { public uint vkCode; public uint scanCode; public uint flags; public uint time; public IntPtr dwExtraInfo; }

    public static void Start(int rfidLength, int rfidTimeout) {
        RFID_LEN = rfidLength;
        RFID_TO = rfidTimeout;
        using (Process currentProcess = Process.GetCurrentProcess())
        using (ProcessModule currentModule = currentProcess.MainModule) {
            _hookID = SetWindowsHookEx(WH_KEYBOARD_LL, _proc, GetModuleHandle(currentModule.ModuleName), 0);
        }
        Application.AddMessageFilter(new GlobalKeyHook());
        Application.Run();
    }

    private static int RFID_LEN = 10;
    private static int RFID_TO = 500;

    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN) {
            KBDLLHOOKSTRUCT kbStruct = (KBDLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(KBDLLHOOKSTRUCT));
            uint vk = kbStruct.vkCode;
            long now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            if (vk == 0x0D) { // VK_RETURN
                if (_buffer.Length == RFID_LEN) {
                    Console.WriteLine(_buffer.ToString());
                    Console.Out.Flush();
                }
                _buffer.Clear();
                _lastKeyTime = 0;
            } else if (vk >= 0x30 && vk <= 0x39) { // 0-9
                if (_lastKeyTime > 0 && (now - _lastKeyTime) > RFID_TO) {
                    _buffer.Clear();
                }
                _buffer.Append((char)vk);
                _lastKeyTime = now;
                if (_buffer.Length > RFID_LEN) { _buffer.Clear(); _lastKeyTime = 0; }
            } else if (vk >= 0x60 && vk <= 0x69) { // Numpad 0-9
                if (_lastKeyTime > 0 && (now - _lastKeyTime) > RFID_TO) {
                    _buffer.Clear();
                }
                _buffer.Append((char)(vk - 0x60 + 0x30));
                _lastKeyTime = now;
                if (_buffer.Length > RFID_LEN) { _buffer.Clear(); _lastKeyTime = 0; }
            } else {
                if (_buffer.Length > 0) { _buffer.Clear(); _lastKeyTime = 0; }
            }
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }

    public bool PreFilterMessage(ref Message m) { return false; }
}
"@ -ReferencedAssemblies System.Windows.Forms

[GlobalKeyHook]::Start($env:RFID_LENGTH, $env:RFID_TIMEOUT_MS)
