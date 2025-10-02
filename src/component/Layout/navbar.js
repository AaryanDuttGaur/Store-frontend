// "use client";

// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { Menu, X, User, LogOut } from "lucide-react";
// import gsap from "gsap";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [accountMenuOpen, setAccountMenuOpen] = useState(false);
//   const mobileMenuRef = useRef(null);
//   const accountMenuRef = useRef(null);

//   // Check if user is logged in on component mount and handle storage changes
//   useEffect(() => {
//     const checkAuthStatus = () => {
//       const accessToken = localStorage.getItem("access_token");
//       const userData = localStorage.getItem("user_data");
      
//       if (accessToken && userData) {
//         try {
//           const parsedUser = JSON.parse(userData);
//           setUser(parsedUser);
//         } catch (error) {
//           console.error("Error parsing user data:", error);
//           localStorage.removeItem("user_data");
//           localStorage.removeItem("access_token");
//           localStorage.removeItem("refresh_token");
//         }
//       } else {
//         setUser(null);
//       }
//     };

//     checkAuthStatus();

//     // Listen for storage changes (when user logs in/out in another tab)
//     const handleStorageChange = () => {
//       checkAuthStatus();
//     };

//     window.addEventListener('storage', handleStorageChange);
    
//     // Also check when component mounts or when localStorage might change
//     const interval = setInterval(checkAuthStatus, 1000);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       clearInterval(interval);
//     };
//   }, []);

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("user_data");
//     setUser(null);
//     setAccountMenuOpen(false);
//     window.location.href = "/";
//   };

//   useEffect(() => {
//     if (menuOpen) {
//       gsap.fromTo(
//         mobileMenuRef.current,
//         { height: 0, autoAlpha: 0 },
//         {
//           height: "auto",
//           autoAlpha: 1,
//           duration: 0.6,
//           ease: "power3.inOut",
//         }
//       );
//     } else {
//       gsap.to(mobileMenuRef.current, {
//         height: 0,
//         autoAlpha: 0,
//         duration: 0.5,
//         ease: "power3.inOut",
//       });
//     }
//   }, [menuOpen]);

//   useEffect(() => {
//     if (accountMenuOpen) {
//       gsap.fromTo(
//         accountMenuRef.current,
//         { opacity: 0, y: -10 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.3,
//           ease: "power2.out",
//         }
//       );
//     }
//   }, [accountMenuOpen]);

//   return (
//     <nav className="fixed top-0 left-0 w-full bg-[#F9B651] shadow-md z-50">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//         {/* Logo */}
//         <Link href="/" className="text-2xl font-bold text-white">
//           Logo
//         </Link>

//         {/* Desktop Nav */}
//         <div className="hidden md:flex space-x-8 items-center">
//           <Link
//             href="/"
//             className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
//           >
//             Home Page
//           </Link>
//           <Link
//             href="/Pages/shop"
//             className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
//           >
//             Shop Now
//           </Link>
//           <Link
//             href="/Pages/about"
//             className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
//           >
//             About Us
//           </Link>
//           <Link
//             href="/Pages/contact"
//             className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
//           >
//             Contact
//           </Link>

//           {/* Conditional Rendering: Login/Sign Up or Account Icon */}
//           {user ? (
//             <Link
//               href="/account"
//               className="flex items-center space-x-2 px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-[#F9B651] transition"
//             >
//               <User size={20} />
//               <span>{user.username}</span>
//             </Link>
//           ) : (
//             <div className="flex space-x-3">
//               <Link
//                 href="/auth/login"
//                 className="px-4 py-2 text-white rounded-lg hover:bg-white hover:text-[#F9B651] transition border border-transparent hover:border-white"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/auth/signup"
//                 className="px-4 py-2 border border-white text-[#F9B651] bg-white rounded-lg hover:bg-[#F9B651] hover:text-white transition"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Mobile Hamburger */}
//         <button
//           className="md:hidden text-white"
//           onClick={() => setMenuOpen((prev) => !prev)}
//         >
//           {menuOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         ref={mobileMenuRef}
//         className="md:hidden bg-[#F9B651] overflow-hidden h-0"
//       >
//         <div className="px-6 py-4 flex flex-col space-y-4">
//           <Link
//             href="/"
//             className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
//           >
//             Home Page
//           </Link>
//           <Link
//             href="/Pages/shop"
//             className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
//           >
//             Shop Now
//           </Link>
//           <Link
//             href="/Pages/about"
//             className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
//           >
//             About Us
//           </Link>
//           <Link
//             href="/Pages/contact"
//             className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
//           >
//             Contact
//           </Link>

//           {/* Mobile Account Section */}
//           {user ? (
//             <div className="border-t border-white/20 pt-4">
//               <Link
//                 href="/account"
//                 className="flex items-center space-x-2 px-3 py-2 text-white rounded-lg hover:bg-white hover:text-[#F9B651] transition"
//               >
//                 <User size={20} />
//                 <div>
//                   <p className="font-medium">{user.username}</p>
//                   {user.customer_id && (
//                     <p className="text-xs text-white/80">ID: {user.customer_id}</p>
//                   )}
//                 </div>
//               </Link>
//             </div>
//           ) : (
//             <div className="border-t border-white/20 pt-4 space-y-3">
//               <Link
//                 href="/auth/login"
//                 className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block border border-transparent hover:border-white"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/auth/signup"
//                 className="px-4 py-2 border border-white text-[#F9B651] bg-white rounded-lg hover:bg-[#F9B651] hover:text-white transition w-fit block"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut, ShoppingCart } from "lucide-react";
import gsap from "gsap";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const mobileMenuRef = useRef(null);
  const accountMenuRef = useRef(null);

  // Check cart items count
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart_items") || "[]");
      const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartItemCount(totalCount);
    };

    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cart-updated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Check if user is logged in on component mount and handle storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user_data");
      
      if (accessToken && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user_data");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } else {
        setUser(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check when component mounts or when localStorage might change
    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setAccountMenuOpen(false);
    window.location.href = "/";
  };

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, autoAlpha: 0 },
        {
          height: "auto",
          autoAlpha: 1,
          duration: 0.6,
          ease: "power3.inOut",
        }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power3.inOut",
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    if (accountMenuOpen) {
      gsap.fromTo(
        accountMenuRef.current,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        }
      );
    }
  }, [accountMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#F9B651] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Velora
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            href="/"
            className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
          >
            Home Page
          </Link>
          <Link
            href="/Pages/shop"
            className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
          >
            Shop Now
          </Link>
          <Link
            href="/Pages/about"
            className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
          >
            About Us
          </Link>
          <Link
            href="/Pages/contact"
            className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
          >
            Contact
          </Link>

          {/* Conditional Rendering: Login/Sign Up or Cart + Account Icons */}
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Cart Icon */}
              <Link
                href="/Pages/cart"
                className="relative flex items-center p-2 text-white rounded-lg hover:bg-white hover:text-[#F9B651] transition"
              >
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account Icon */}
              <Link
                href="/account"
                className="flex items-center space-x-2 px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-[#F9B651] transition"
              >
                <User size={20} />
                <span>{user.username}</span>
              </Link>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-white rounded-lg hover:bg-white hover:text-[#F9B651] transition border border-transparent hover:border-white"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 border border-white text-[#F9B651] bg-white rounded-lg hover:bg-[#F9B651] hover:text-white transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="md:hidden bg-[#F9B651] overflow-hidden h-0"
      >
        <div className="px-6 py-4 flex flex-col space-y-4">
          <Link
            href="/"
            className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
          >
            Home Page
          </Link>
          <Link
            href="/Pages/shop"
            className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
          >
            Shop Now
          </Link>
          <Link
            href="/Pages/about"
            className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
          >
            About Us
          </Link>
          <Link
            href="/Pages/contact"
            className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition"
          >
            Contact
          </Link>

          {/* Mobile Account Section */}
          {user ? (
            <div className="border-t border-white/20 pt-4 space-y-3">
              {/* Mobile Cart Link */}
              <Link
                href="/Pages/cart"
                className="flex items-center justify-between px-3 py-2 text-white rounded-lg hover:bg-white hover:text-[#F9B651] transition"
              >
                <div className="flex items-center space-x-2">
                  <ShoppingCart size={20} />
                  <span>My Cart</span>
                </div>
                {cartItemCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
              
              {/* Mobile Account Link */}
              <Link
                href="/account"
                className="flex items-center space-x-2 px-3 py-2 text-white rounded-lg hover:bg-white hover:text-[#F9B651] transition"
              >
                <User size={20} />
                <div>
                  <p className="font-medium">{user.username}</p>
                  {user.customer_id && (
                    <p className="text-xs text-white/80">ID: {user.customer_id}</p>
                  )}
                </div>
              </Link>
            </div>
          ) : (
            <div className="border-t border-white/20 pt-4 space-y-3">
              <Link
                href="/auth/login"
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block border border-transparent hover:border-white"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 border border-white text-[#F9B651] bg-white rounded-lg hover:bg-[#F9B651] hover:text-white transition w-fit block"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}