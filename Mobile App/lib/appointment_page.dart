import 'dart:ui';
import 'package:flutter/material.dart';

class AppointmentsPage extends StatelessWidget {
  const AppointmentsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    // Mock data for appointments
    final List<Map<String, String>> appointments = [
      {"doctor": "Dr. Smith", "date": "Monday, 10:30 AM", "reason": "General Check-up"},
      {"doctor": "Dr. Jones", "date": "Wednesday, 4:00 PM", "reason": "Follow-up"},
      {"doctor": "Dr. Lee", "date": "Friday, 9:00 AM", "reason": "Dental Cleaning"},
      {"doctor": "Dr. Patel", "date": "Next Tuesday, 11:00 AM", "reason": "Physical Exam"},
      {"doctor": "Dr. Garcia", "date": "Next Thursday, 3:30 PM", "reason": "Consultation"},
    ];

    return Column(
      children: [
        AppBar(
          automaticallyImplyLeading: false,
          title: Text(
            'My Appointments',
            style: TextStyle(
              color: Colors.white,
              fontSize: screenWidth * 0.07,
              fontWeight: FontWeight.bold,
            ),
          ),
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
            itemCount: appointments.length,
            itemBuilder: (context, index) {
              final appointment = appointments[index];
              return Card(
                color: Colors.white.withAlpha(220),
                margin: const EdgeInsets.only(bottom: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                  leading: const Icon(Icons.medical_services_outlined, color: Color(0xFF0095D1), size: 40),
                  title: Text(
                    appointment['doctor']!,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(appointment['reason']!),
                      const SizedBox(height: 2),
                      Text(appointment['date']!),
                    ],
                  ),
                  isThreeLine: true,
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
