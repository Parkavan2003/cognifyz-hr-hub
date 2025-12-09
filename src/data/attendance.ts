export type AttendanceStatus = "Present" | "Absent" | "Half Day" | "Leave";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

// Generate attendance records for November 2024
function generateAttendanceData(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const employeeIds = Array.from({ length: 22 }, (_, i) => String(i + 1));
  
  // Generate for November 2024
  for (let day = 1; day <= 30; day++) {
    const date = `2024-11-${day.toString().padStart(2, '0')}`;
    const dayOfWeek = new Date(date).getDay();
    
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    for (const empId of employeeIds) {
      // Random attendance with 90% present rate
      const random = Math.random();
      let status: AttendanceStatus;
      
      if (random < 0.85) {
        status = "Present";
      } else if (random < 0.92) {
        status = "Leave";
      } else if (random < 0.97) {
        status = "Half Day";
      } else {
        status = "Absent";
      }
      
      records.push({
        id: `att-${empId}-${date}`,
        employeeId: empId,
        date,
        status,
        checkIn: status === "Present" || status === "Half Day" ? "09:00" : undefined,
        checkOut: status === "Present" ? "18:00" : status === "Half Day" ? "13:00" : undefined,
      });
    }
  }
  
  // Add December 2024 records
  for (let day = 1; day <= 9; day++) {
    const date = `2024-12-${day.toString().padStart(2, '0')}`;
    const dayOfWeek = new Date(date).getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    for (const empId of employeeIds) {
      const random = Math.random();
      let status: AttendanceStatus;
      
      if (random < 0.85) {
        status = "Present";
      } else if (random < 0.92) {
        status = "Leave";
      } else if (random < 0.97) {
        status = "Half Day";
      } else {
        status = "Absent";
      }
      
      records.push({
        id: `att-${empId}-${date}`,
        employeeId: empId,
        date,
        status,
        checkIn: status === "Present" || status === "Half Day" ? "09:00" : undefined,
        checkOut: status === "Present" ? "18:00" : status === "Half Day" ? "13:00" : undefined,
      });
    }
  }
  
  return records;
}

export const initialAttendance: AttendanceRecord[] = generateAttendanceData();

export function getAttendanceStatusColor(status: AttendanceStatus): string {
  const colors: Record<AttendanceStatus, string> = {
    Present: "bg-success/10 text-success",
    Absent: "bg-destructive/10 text-destructive",
    "Half Day": "bg-warning/10 text-warning",
    Leave: "bg-info/10 text-info",
  };
  return colors[status];
}

export function calculateAttendanceStats(records: AttendanceRecord[]) {
  const total = records.length;
  const present = records.filter(r => r.status === "Present").length;
  const absent = records.filter(r => r.status === "Absent").length;
  const halfDay = records.filter(r => r.status === "Half Day").length;
  const leave = records.filter(r => r.status === "Leave").length;
  
  return {
    total,
    present,
    absent,
    halfDay,
    leave,
    presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
    effectivePresent: present + (halfDay * 0.5),
  };
}
