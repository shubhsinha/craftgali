import 'package:flutter/material.dart';

void main() {
  runApp(const CraftgaliApp());
}

class CraftgaliApp extends StatelessWidget {
  const CraftgaliApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Craftgali',
      theme: ThemeData(useMaterial3: true),
      home: const Scaffold(
        body: Center(child: Text('Craftgali')),
      ),
    );
  }
}
