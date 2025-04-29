import Link from "next/link"
import { BookOpen, BookText, Users, Clock, BarChart4, Check } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-[#39FF14]/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-[#39FF14]" />
            <span className="text-xl font-bold text-gray-800">AAA Battery</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-800">
              Features
            </a>
            <a href="#stats" className="text-gray-600 hover:text-gray-800">
              Stats
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-800">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="inline-flex h-10 items-center justify-center rounded-md border border-[#39FF14] bg-transparent px-4 py-2 text-sm font-medium text-[#39FF14] shadow-sm transition-colors hover:bg-[#39FF14]/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Log In
            </Link>
            <Link
              href="/auth?tab=signup"
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-3 py-1 bg-[#39FF14]/10 text-[#39FF14] rounded-full text-sm font-medium">
                Smart Library Management
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Streamline Your Library Operations
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                LibraryPro helps educational institutions and public libraries manage their collections, track loans,
                and engage with readers more effectively.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/auth"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-[#39FF14] px-8 text-lg font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Start for Free
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-gray-300 bg-transparent px-8 text-lg font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="flex-1 rounded-lg overflow-hidden shadow-xl border-2 border-[#39FF14]/20">
              <div className="aspect-video bg-white p-6 flex items-center justify-center">
                <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="h-8 w-8 text-[#39FF14]" />
                    <div>
                      <h3 className="font-bold text-gray-800">Collection Dashboard</h3>
                      <p className="text-sm text-gray-500">Manage your entire library</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between bg-white p-3 rounded border border-gray-200">
                      <span className="font-medium">Total Collection</span>
                      <span className="text-[#39FF14] font-bold">12,458</span>
                    </div>
                    <div className="flex justify-between bg-white p-3 rounded border border-gray-200">
                      <span className="font-medium">Books on Loan</span>
                      <span className="text-[#39FF14] font-bold">1,287</span>
                    </div>
                    <div className="flex justify-between bg-white p-3 rounded border border-gray-200">
                      <span className="font-medium">Available</span>
                      <span className="text-[#39FF14] font-bold">11,171</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Everything You Need to Manage Your Library
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive solution handles all aspects of library management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <BookText className="h-10 w-10 text-[#39FF14] mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Catalog Management</h3>
              <p className="text-gray-600">
                Easily catalog and organize your collection with comprehensive metadata and search capabilities.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <Users className="h-10 w-10 text-[#39FF14] mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Member Management</h3>
              <p className="text-gray-600">
                Keep track of member information, borrowing history, and preferences for personalized service.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <Clock className="h-10 w-10 text-[#39FF14] mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Circulation Control</h3>
              <p className="text-gray-600">
                Streamline check-outs, returns, renewals, and reservations with our intuitive system.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <BarChart4 className="h-10 w-10 text-[#39FF14] mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analytics & Reports</h3>
              <p className="text-gray-600">
                Gain insights into collection usage, popular titles, and member activity with detailed reports.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <BookOpen className="h-10 w-10 text-[#39FF14] mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Digital Resources</h3>
              <p className="text-gray-600">
                Manage e-books, audiobooks, and digital media alongside your physical collection.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <Users className="h-10 w-10 text-[#39FF14] mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Self-Service Options</h3>
              <p className="text-gray-600">
                Empower users with self-checkout kiosks, online reservations, and account management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4 bg-[#39FF14]/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#39FF14] mb-2">500+</div>
              <p className="text-gray-700">Libraries Using Our System</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#39FF14] mb-2">5M+</div>
              <p className="text-gray-700">Books Managed</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#39FF14] mb-2">2M+</div>
              <p className="text-gray-700">Active Members</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#39FF14] mb-2">99.9%</div>
              <p className="text-gray-700">System Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Trusted by Librarians Everywhere</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from professionals who transformed their libraries with our system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#39FF14]/20 flex items-center justify-center mr-4">
                  <span className="text-[#39FF14] font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Jane Doe</h4>
                  <p className="text-sm text-gray-500">Head Librarian, City Public Library</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "LibraryPro revolutionized how we manage our collection. The intuitive interface made staff training
                simple, and our members love the self-service features."
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#39FF14]/20 flex items-center justify-center mr-4">
                  <span className="text-[#39FF14] font-bold">RB</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Robert Brown</h4>
                  <p className="text-sm text-gray-500">Library Director, State University</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The analytics tools have given us incredible insights into collection usage. We've optimized our
                acquisitions and improved student satisfaction significantly."
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#39FF14]/20 flex items-center justify-center mr-4">
                  <span className="text-[#39FF14] font-bold">MS</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Maria Silva</h4>
                  <p className="text-sm text-gray-500">Librarian, Central High School</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Our small school library needed an affordable but powerful solution. LibraryPro delivered exactly what
                we needed with excellent support throughout implementation."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Library?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join hundreds of institutions that trust LibraryPro for their library management needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#39FF14] px-8 text-lg font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-md border border-gray-600 bg-transparent px-8 text-lg font-medium text-gray-200 shadow-sm transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Learn More
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Check className="h-5 w-5 text-[#39FF14]" />
              <span>Free 30-day trial</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Check className="h-5 w-5 text-[#39FF14]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Check className="h-5 w-5 text-[#39FF14]" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-[#39FF14]" />
                <span className="text-lg font-bold text-gray-800">LibraryPro</span>
              </div>
              <p className="text-gray-600 mb-4">Modern library management for the digital age.</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    Reviews
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#39FF14]">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>© 2023 LibraryPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
