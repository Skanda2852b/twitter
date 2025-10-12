"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Mic, Key, CreditCard, Globe, History, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const TestFeatures = () => {
  const features = [
    {
      id: 'notifications',
      title: '🔔 Notification System',
      description: 'Browser notifications for cricket and science tweets with enable/disable toggle',
      icon: Bell,
      status: 'Completed',
      path: '/profile',
      details: [
        'Detects tweets containing "cricket" or "science" keywords',
        'Shows browser notifications with full tweet content',
        'User can enable/disable notifications in profile settings',
        'Real-time notification checking every 30 seconds'
      ]
    },
    {
      id: 'audio-tweets',
      title: '🎤 Audio Tweet Feature',
      description: 'Record and post audio tweets with OTP verification and time restrictions',
      icon: Mic,
      status: 'Completed',
      path: '/',
      details: [
        'Audio recording with 5-minute and 100MB limits',
        'OTP verification via email before upload',
        'Only available between 2:00 PM - 7:00 PM IST',
        'Audio playback in tweet cards'
      ]
    },
    {
      id: 'forgot-password',
      title: '🔐 Forgot Password System',
      description: 'Password reset with daily limits and random password generator',
      icon: Key,
      status: 'Completed',
      path: '/forgot-password',
      details: [
        'Reset via email or phone number',
        'Only 1 request per day allowed',
        'Random password generator (letters only)',
        'Password copied to clipboard'
      ]
    },
    {
      id: 'subscriptions',
      title: '💳 Subscription Plans',
      description: 'Payment gateway integration with time-restricted payments',
      icon: CreditCard,
      status: 'Completed',
      path: '/subscriptions',
      details: [
        'Free Plan: 1 tweet/month',
        'Bronze Plan: ₹100/month - 3 tweets',
        'Silver Plan: ₹300/month - 5 tweets',
        'Gold Plan: ₹1000/month - unlimited tweets',
        'Payments only between 10:00 AM - 11:00 AM IST',
        'Email invoice after payment'
      ]
    },
    {
      id: 'multi-language',
      title: '🌐 Multi-Language Support',
      description: '6 languages with OTP verification for language switching',
      icon: Globe,
      status: 'Completed',
      path: '/language',
      details: [
        'Supported languages: English, Spanish, Hindi, Portuguese, Chinese, French',
        'French requires email OTP verification',
        'Other languages require phone OTP verification',
        'OTP expires in 10 minutes'
      ]
    },
    {
      id: 'login-tracking',
      title: '📱 Login History & Tracking',
      description: 'Device detection and browser-specific access rules',
      icon: History,
      status: 'Completed',
      path: '/login-history',
      details: [
        'Tracks IP address, browser, OS, and device type',
        'Chrome browser requires OTP verification',
        'Microsoft Edge allows direct access',
        'Mobile access only between 10:00 AM - 1:00 PM IST',
        'Login history display with security status'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Twiller 2.0 Features</h1>
          <p className="text-gray-400 text-lg">All requested features have been implemented and are working!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                  <span>{feature.title}</span>
                </CardTitle>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-400 font-medium">{feature.status}</span>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-gray-300">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={feature.path}>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      Test Feature
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-green-900/20 border-green-500">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 All Features Implemented!</h2>
              <p className="text-green-300 mb-4">
                All 6 requested features have been successfully implemented with full functionality:
              </p>
              <ul className="text-left text-green-200 space-y-2 max-w-2xl mx-auto">
                <li>✅ Notification system with browser API integration</li>
                <li>✅ Audio tweets with OTP verification and time restrictions</li>
                <li>✅ Forgot password with daily limits and password generator</li>
                <li>✅ Subscription plans with payment gateway integration</li>
                <li>✅ Multi-language support with OTP verification</li>
                <li>✅ Login tracking with device detection and access rules</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Navigate to different pages to test each feature. All backend routes are properly configured.</p>
        </div>
      </div>
    </div>
  );
};

export default TestFeatures;
