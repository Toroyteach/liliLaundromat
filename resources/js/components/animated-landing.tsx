"use client"

import { router } from '@inertiajs/react'
import { Shirt, Droplets, Wind } from "lucide-react"

export function AnimatedLanding() {å

  const handleLaundroMartClick = () => {
    router.visit('/login')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-20 h-20 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-20 h-20 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Animation */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
              {/* Laundry Basket */}
              <div className="absolute left-0 animate-slide-right">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-lg shadow-lg flex items-center justify-center">
                  <Shirt className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>

              {/* Animated Path */}
              <svg className="absolute w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                <path
                  d="M 50 150 Q 150 50, 300 150"
                  stroke="#e0e7ff"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>

              {/* Laundromat Building */}
              <div
                className="absolute right-0 cursor-pointer transform hover:scale-110 transition-transform duration-300"
                onClick={handleLaundroMartClick}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-teal-500 to-cyan-600 rounded-lg shadow-xl flex flex-col items-center justify-center hover:shadow-2xl transition-shadow">
                  <Droplets className="w-8 h-8 md:w-10 md:h-10 text-white mb-1" />
                  <Wind className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <p className="text-center text-xs md:text-sm font-semibold text-teal-700 mt-2">LaundroMart</p>
              </div>
            </div>

            {/* Animation Info */}
            <div className="mt-8 text-center">
              <p className="text-sm md:text-base text-gray-600">
                Click the <span className="font-semibold text-teal-600">LaundroMart</span> icon to get started
              </p>
            </div>
          </div>

          {/* Right Side - Welcome Text */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Welcome to <span className="text-teal-600">LaundroHub</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                Manage your laundromat operations with ease. Track orders, process payments, and keep your business
                running smoothly.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">24/7</div>
                <p className="text-xs md:text-sm text-gray-600">Available</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">100%</div>
                <p className="text-xs md:text-sm text-gray-600">Secure</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">∞</div>
                <p className="text-xs md:text-sm text-gray-600">Scalable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes slide-right {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px);
            opacity: 0;
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-slide-right {
          animation: slide-right 3s infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
