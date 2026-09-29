// Bundled forensic evidence files. All fictional, generated for teaching.

export interface EvidenceFile {
  name: string;
  magic: string; // `file` output
  strings: string[]; // `strings` output
  exif?: Record<string, string>; // `exiftool` output
  hexPreview?: string[]; // `hexdump -C` first lines
  textLines?: string[]; // `cat` output
  carveResult?: string; // `carve` output (hidden data)
}

export const EVIDENCE: Record<string, EvidenceFile> = {
  "photo.jpg": {
    name: "photo.jpg",
    magic: "JPEG image data, 1024x768",
    strings: [
      "JFIF",
      "Canon",
      "vacation-photo",
      "PK\x03\x04", // zip local file header — hidden archive!
    ],
    exif: {
      "File Name": "photo.jpg",
      "Camera Model": "Canon EOS 2000D",
      "Date Taken": "2026-03-14 18:22:09",
      "GPS Latitude": "33.7294 N",
      "GPS Longitude": "73.0931 E",
      "Comment": "nothing to see here :)",
    },
    hexPreview: [
      "00000000  ff d8 ff e0 00 10 4a 46  49 46 00 01 01 00 00 01  |......JFIF......|",
      "00000010  00 01 00 00 ff fe 00 1c  43 61 6e 6f 6e 20 45 4f  |........Canon EO|",
    ],
    carveResult:
      "carved hidden.zip from photo.jpg (offset 0x4E200)\n" +
      "hidden.zip contains: secret.txt\n" +
      'secret.txt: "meet at the usual place — R."',
  },
  "mystery.bin": {
    name: "mystery.bin",
    magic: "ELF 64-bit LSB executable, x86-64",
    strings: [
      "/lib64/ld-linux-x86-64.so.2",
      "Enter password:",
      "password=Sup3rS3cret!",
      "Access granted.",
      "Access denied.",
      "GCC: (Ubuntu 11.4.0)",
    ],
    hexPreview: [
      "00000000  7f 45 4c 46 02 01 01 00  00 00 00 00 00 00 00 00  |.ELF............|",
      "00000010  03 00 3e 00 01 00 00 00  10 10 00 00 00 00 00 00  |..>.............|",
    ],
  },
  "access.log": {
    name: "access.log",
    magic: "ASCII text",
    strings: ["GET", "POST", "HTTP/1.1", "203.0.113.77"],
    textLines: [
      '192.168.56.50 - - [14/Mar/2026:09:12:01] "GET /index.html HTTP/1.1" 200 512',
      '192.168.56.50 - - [14/Mar/2026:09:12:03] "GET /about.html HTTP/1.1" 200 318',
      '203.0.113.77 - - [14/Mar/2026:09:14:55] "GET /admin HTTP/1.1" 404 211',
      '203.0.113.77 - - [14/Mar/2026:09:15:02] "GET /admin/ HTTP/1.1" 404 211',
      '203.0.113.77 - - [14/Mar/2026:09:15:09] "POST /login HTTP/1.1" 200 1024',
      '203.0.113.77 - - [14/Mar/2026:09:15:10] "GET /../../etc/passwd HTTP/1.1" 403 198',
      '192.168.56.50 - - [14/Mar/2026:09:16:41] "GET /contact.html HTTP/1.1" 200 290',
    ],
  },
  "memdump.txt": {
    name: "memdump.txt",
    magic: "ASCII text",
    strings: ["svch0st.exe", "explorer.exe", "lsass.exe"],
    textLines: [
      "PID   PPID  NAME",
      "4     0     System",
      "512   4     smss.exe",
      "680   512   csrss.exe",
      "720   512   wininit.exe",
      "800   720   services.exe",
      "824   720   lsass.exe",
      "1104  800   svchost.exe",
      "1188  800   svchost.exe",
      "2048  1104  explorer.exe",
      "3133  2048  svch0st.exe   <-- NOTE: zero, not 'o'",
      "3140  3133  powershell.exe -enc aQBmACgAWwBJAG8ALgBGAGkAbABlAF0A",
    ],
  },
};

export const EVIDENCE_DIR = Object.keys(EVIDENCE);
