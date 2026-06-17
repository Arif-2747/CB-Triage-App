import 'package:flutter/material.dart';

class SymptomHistoryPage extends StatelessWidget {
  const SymptomHistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data for symptom logs
    final List<Map<String, String>> symptomLogs = [
      {
        "date": "July 26, 2024",
        "log": "Feeling a bit tired today, with a mild headache in the afternoon.",
        "severity": "Mild"
      },
      {
        "date": "July 25, 2024",
        "log": "Woke up with a sore throat. Pain is moderate when swallowing.",
        "severity": "Moderate"
      },
      {
        "date": "July 24, 2024",
        "log": "Knee pain was severe after the morning walk. Had to take it easy for the rest of the day.",
        "severity": "Severe"
      },
    ];

    Color getSeverityColor(String severity) {
      switch (severity) {
        case 'Mild':
          return Colors.green;
        case 'Moderate':
          return Colors.orange;
        case 'Severe':
          return Colors.red;
        default:
          return Colors.grey;
      }
    }

    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF00D2FF),
            Color(0xFF3A7BD5),
          ],
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          title: const Text('Symptom History', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.transparent,
          elevation: 0,
          iconTheme: const IconThemeData(color: Colors.white),
        ),
        body: ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          itemCount: symptomLogs.length,
          itemBuilder: (context, index) {
            final log = symptomLogs[index];
            return Card(
              color: Colors.white.withAlpha(230),
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          log['date']!,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: getSeverityColor(log['severity']!),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            log['severity']!,
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      log['log']!,
                      style: TextStyle(fontSize: 15, color: Colors.grey[800]),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
