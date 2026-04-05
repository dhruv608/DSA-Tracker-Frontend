"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Code, Zap, BookOpen, Rocket, Heart, Github, Linkedin } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Our About Story</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Brute
              </span>
              <span className="text-primary ml-3">Force</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Where every coding journey begins. From simple solutions to elegant algorithms.
            </p>

            {/* CTA Button */}
            <Link 
              href="/topics"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-all duration-300"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">The Philosophy</h2>
              <p className="text-muted-foreground">
                Every expert was once a beginner. Start with simple approaches and evolve to optimized solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <BookOpen className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-bold mb-2">Learn the Basics</h3>
                <p className="text-sm text-muted-foreground">
                  Start with brute force solutions. Focus on correctness before optimization.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card">
                <Rocket className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-bold mb-2">Evolve & Optimize</h3>
                <p className="text-sm text-muted-foreground">
                  Master optimization techniques and write efficient, scalable code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Journey */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Learning Journey</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-border bg-card text-center">
                <div className="w-8 h-8 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <h3 className="font-bold mb-2">Start Simple</h3>
                <p className="text-sm text-muted-foreground">
                  Focus on correctness, not efficiency
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <h3 className="font-bold mb-2">Analyze & Improve</h3>
                <p className="text-sm text-muted-foreground">
                  Learn optimization techniques
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card text-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <h3 className="font-bold mb-2">Master Complexity</h3>
                <p className="text-sm text-muted-foreground">
                  Write optimal solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Built with Passion</h2>
              <p className="text-muted-foreground">Created by students who understand the learning journey</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="p-6 rounded-2xl border border-border bg-card text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary">DN</span>
                </div>
                <h3 className="font-bold mb-1">Dhruv Narang</h3>
                <p className="text-sm text-muted-foreground mb-3">Student, SOT24B1</p>
                <div className="flex justify-center gap-2">
                  <a href="https://linkedin.com/in/dhruv-narang" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-muted rounded-2xl flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="https://github.com/dhruv-narang" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-muted rounded-2xl flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary">AC</span>
                </div>
                <h3 className="font-bold mb-1">Ayush Chaurasiya</h3>
                <p className="text-sm text-muted-foreground mb-3">Student, SOT24B1</p>
                <div className="flex justify-center gap-2">
                  <a href="https://linkedin.com/in/ayush-chaurasiya" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-muted rounded-2xl flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="https://github.com/ayush-chaurasiya" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-muted rounded-2xl flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
