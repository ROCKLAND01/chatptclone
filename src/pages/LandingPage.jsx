/**
 * Landing Page Component
 * Public page with Sign In / Sign Up functionality
 */

import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { MessageSquare, Zap, Shield, Code } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#10a37f] flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            <span className="font-semibold text-[var(--text-primary)]">ChatGPT Clone</span>
          </div>

          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="btn-secondary">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary">Get Started</button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="heading-1 text-[var(--text-primary)] mb-6">
            Your Intelligent AI Assistant
          </h1>
          <p className="body-text text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
            Experience the power of conversational AI. Get instant answers, 
            help with coding, creative writing, and so much more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <button className="btn-primary text-lg px-8 py-3">
                Start Chatting Free
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="btn-secondary text-lg px-8 py-3">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <FeatureCard
            icon={<Zap className="text-[#10a37f]" size={28} />}
            title="Lightning Fast"
            description="Get instant responses powered by advanced AI models with low latency."
          />
          <FeatureCard
            icon={<Code className="text-[#10a37f]" size={28} />}
            title="Code Helper"
            description="Debug, write, and understand code in any programming language."
          />
          <FeatureCard
            icon={<Shield className="text-[#10a37f]" size={28} />}
            title="Secure & Private"
            description="Your conversations are protected with enterprise-grade security."
          />
        </div>

        {/* Chat Preview */}
        <div className="mt-20 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-[var(--border-color)] shadow-lg overflow-hidden bg-[var(--bg-primary)]">
            <div className="bg-[var(--bg-secondary)] px-4 py-3 border-b border-[var(--border-color)] flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-sm text-[var(--text-muted)] ml-2">ChatGPT Clone</span>
            </div>
            <div className="p-4 space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="message-bubble message-user">
                  <p>How do I center a div in CSS?</p>
                </div>
              </div>
              {/* AI response */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={16} className="text-white" />
                </div>
                <div className="max-w-[80%]">
                  <p className="text-[var(--text-primary)] mb-2">
                    There are several ways to center a div in CSS:
                  </p>
                  <div className="bg-gray-800 text-gray-100 dark:bg-gray-900 rounded-lg p-3 text-sm font-mono border border-gray-700">
                    <code>display: flex;</code><br />
                    <code>justify-content: center;</code><br />
                    <code>align-items: center;</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] mt-20">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Powered by <span className="font-medium">Samson</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Feature Card Component
 */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-xl border border-[var(--border-color)] hover:border-[#10a37f]/30 hover:shadow-md transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-[#10a37f]/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
