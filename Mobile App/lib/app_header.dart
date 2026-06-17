import 'package:flutter/material.dart';

class AppHeader extends StatefulWidget {
  const AppHeader({super.key});

  @override
  State<AppHeader> createState() => _AppHeaderState();
}

class _AppHeaderState extends State<AppHeader>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeInOut,
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Column(
      children: [
        AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            double fillStop = 0.6 * _animation.value;
            return ShaderMask(
              shaderCallback: (bounds) {
                return RadialGradient(
                  center: Alignment.center,
                  radius: 1.0,
                  colors: [
                    Colors.white,
                    Colors.white,
                    Colors.white.withAlpha(0)
                  ],
                  stops: [0.0, fillStop, fillStop + 0.2],
                ).createShader(bounds);
              },
              child: Icon(
                Icons.favorite,
                color: Colors.white,
                size: screenHeight * 0.1,
              ),
            );
          },
        ),
        SizedBox(height: screenHeight * 0.02),
        Text(
          'CB - TRIAGE',
          style: TextStyle(
            color: Colors.white,
            fontSize: screenWidth * 0.08,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        SizedBox(height: screenHeight * 0.01),
        const Text(
          'Your health, managed.',
          style: TextStyle(
            color: Colors.white70,
            fontSize: 16,
          ),
        ),
        SizedBox(height: screenHeight * 0.05),
      ],
    );
  }
}
