// Pre-generated packet capture datasets for the network analysis track.
// Rendered by the packet viewer page and the `tshark` terminal command.

export interface Packet {
  no: number;
  time: string;
  src: string;
  dst: string;
  proto: string;
  info: string;
}

export interface Capture {
  id: string;
  name: string;
  desc: string;
  packets: Packet[];
}

function pkt(no: number, time: string, src: string, dst: string, proto: string, info: string): Packet {
  return { no, time, src, dst, proto, info };
}

export const CAPTURES: Record<string, Capture> = {
  "web-normal": {
    id: "web-normal",
    name: "Normal web browsing",
    desc: "A user visits a website. Learn what healthy traffic looks like first.",
    packets: [
      pkt(1, "0.000", "192.168.56.50", "8.8.8.8", "DNS", "Standard query A example.com"),
      pkt(2, "0.021", "8.8.8.8", "192.168.56.50", "DNS", "Standard query response A 93.184.216.34"),
      pkt(3, "0.030", "192.168.56.50", "93.184.216.34", "TCP", "80 → 443 [SYN] Seq=0"),
      pkt(4, "0.052", "93.184.216.34", "192.168.56.50", "TCP", "443 → 80 [SYN, ACK] Seq=0 Ack=1"),
      pkt(5, "0.053", "192.168.56.50", "93.184.216.34", "TCP", "80 → 443 [ACK] Seq=1 Ack=1"),
      pkt(6, "0.061", "192.168.56.50", "93.184.216.34", "TLS", "Client Hello (SNI=example.com)"),
      pkt(7, "0.090", "93.184.216.34", "192.168.56.50", "TLS", "Server Hello, Certificate"),
      pkt(8, "0.120", "192.168.56.50", "93.184.216.34", "HTTP", "GET / HTTP/1.1"),
      pkt(9, "0.150", "93.184.216.34", "192.168.56.50", "HTTP", "HTTP/1.1 200 OK (text/html)"),
      pkt(10, "0.155", "192.168.56.50", "93.184.216.34", "TCP", "80 → 443 [FIN, ACK]"),
    ],
  },
  "port-scan": {
    id: "port-scan",
    name: "The port scan",
    desc: "Someone is sweeping the target. Find who, and what they looked at.",
    packets: [
      pkt(1, "0.000", "192.168.56.10", "192.168.56.20", "TCP", "51234 → 21 [SYN] Seq=0"),
      pkt(2, "0.001", "192.168.56.20", "192.168.56.10", "TCP", "21 → 51234 [SYN, ACK] Seq=0 Ack=1"),
      pkt(3, "0.002", "192.168.56.10", "192.168.56.20", "TCP", "51234 → 21 [RST]"),
      pkt(4, "0.010", "192.168.56.10", "192.168.56.20", "TCP", "51235 → 22 [SYN] Seq=0"),
      pkt(5, "0.011", "192.168.56.20", "192.168.56.10", "TCP", "22 → 51235 [SYN, ACK] Seq=0 Ack=1"),
      pkt(6, "0.012", "192.168.56.10", "192.168.56.20", "TCP", "51235 → 22 [RST]"),
      pkt(7, "0.020", "192.168.56.10", "192.168.56.20", "TCP", "51236 → 23 [SYN] Seq=0"),
      pkt(8, "0.021", "192.168.56.20", "192.168.56.10", "TCP", "23 → 51236 [RST, ACK]"),
      pkt(9, "0.030", "192.168.56.10", "192.168.56.20", "TCP", "51237 → 80 [SYN] Seq=0"),
      pkt(10, "0.031", "192.168.56.20", "192.168.56.10", "TCP", "80 → 51237 [SYN, ACK] Seq=0 Ack=1"),
      pkt(11, "0.032", "192.168.56.10", "192.168.56.20", "TCP", "51237 → 80 [RST]"),
      pkt(12, "0.040", "192.168.56.10", "192.168.56.20", "TCP", "51238 → 445 [SYN] Seq=0"),
      pkt(13, "0.041", "192.168.56.20", "192.168.56.10", "TCP", "445 → 51238 [SYN, ACK] Seq=0 Ack=1"),
      pkt(14, "0.042", "192.168.56.10", "192.168.56.20", "TCP", "51238 → 445 [RST]"),
      pkt(15, "0.050", "192.168.56.10", "192.168.56.20", "TCP", "51239 → 3306 [SYN] Seq=0"),
      pkt(16, "0.051", "192.168.56.20", "192.168.56.10", "TCP", "3306 → 51239 [SYN, ACK] Seq=0 Ack=1"),
      pkt(17, "0.052", "192.168.56.10", "192.168.56.20", "TCP", "51239 → 3306 [RST]"),
      pkt(18, "0.060", "192.168.56.10", "192.168.56.20", "TCP", "51240 → 6667 [SYN] Seq=0"),
      pkt(19, "0.061", "192.168.56.20", "192.168.56.10", "TCP", "6667 → 51240 [SYN, ACK] Seq=0 Ack=1"),
      pkt(20, "0.062", "192.168.56.10", "192.168.56.20", "TCP", "51240 → 6667 [RST]"),
    ],
  },
  beaconing: {
    id: "beaconing",
    name: "The infected host",
    desc: "One host on the network is calling home on a schedule. Find it.",
    packets: [
      pkt(1, "0.0", "192.168.56.50", "8.8.8.8", "DNS", "Standard query A example.com"),
      pkt(2, "0.1", "192.168.56.30", "203.0.113.99", "TCP", "49152 → 443 [SYN] Seq=0"),
      pkt(3, "0.2", "203.0.113.99", "192.168.56.30", "TCP", "443 → 49152 [SYN, ACK]"),
      pkt(4, "0.3", "192.168.56.30", "203.0.113.99", "TLS", "Application Data (412 bytes)"),
      pkt(5, "12.4", "192.168.56.50", "93.184.216.34", "HTTP", "GET /news HTTP/1.1"),
      pkt(6, "60.2", "192.168.56.30", "203.0.113.99", "TCP", "49153 → 443 [SYN] Seq=0"),
      pkt(7, "60.3", "203.0.113.99", "192.168.56.30", "TCP", "443 → 49153 [SYN, ACK]"),
      pkt(8, "60.4", "192.168.56.30", "203.0.113.99", "TLS", "Application Data (412 bytes)"),
      pkt(9, "75.0", "192.168.56.50", "8.8.4.4", "DNS", "Standard query A mail.example.com"),
      pkt(10, "120.2", "192.168.56.30", "203.0.113.99", "TCP", "49154 → 443 [SYN] Seq=0"),
      pkt(11, "120.3", "203.0.113.99", "192.168.56.30", "TCP", "443 → 49154 [SYN, ACK]"),
      pkt(12, "120.4", "192.168.56.30", "203.0.113.99", "TLS", "Application Data (412 bytes)"),
      pkt(13, "180.2", "192.168.56.30", "203.0.113.99", "TCP", "49155 → 443 [SYN] Seq=0"),
      pkt(14, "180.4", "192.168.56.30", "203.0.113.99", "TLS", "Application Data (412 bytes)"),
    ],
  },
  "dns-exfil": {
    id: "dns-exfil",
    name: "DNS exfiltration",
    desc: "Data is leaving the network inside DNS queries. Prove it.",
    packets: [
      pkt(1, "0.00", "192.168.56.40", "8.8.8.8", "DNS", "Standard query A www.example.com"),
      pkt(2, "0.02", "8.8.8.8", "192.168.56.40", "DNS", "Standard query response A 93.184.216.34"),
      pkt(3, "1.10", "192.168.56.40", "8.8.8.8", "DNS", "Standard query TXT 4a6f686e446f65313233.evil.example.com"),
      pkt(4, "1.25", "8.8.8.8", "192.168.56.40", "DNS", "Standard query response TXT (63 bytes)"),
      pkt(5, "2.10", "192.168.56.40", "8.8.8.8", "DNS", "Standard query TXT 50617373776f72643d733363723374.evil.example.com"),
      pkt(6, "3.10", "192.168.56.40", "8.8.8.8", "DNS", "Standard query TXT 456e644f665265636f72642e.evil.example.com"),
      pkt(7, "4.00", "192.168.56.40", "8.8.8.8", "DNS", "Standard query A mail.example.com"),
      pkt(8, "5.10", "192.168.56.40", "8.8.8.8", "DNS", "Standard query TXT 4163636f756e744e756d6265723d3938.evil.example.com"),
    ],
  },
};

export const CAPTURE_IDS = Object.keys(CAPTURES);
