import Image from 'next/image'
import logo from '../../../public/assets/logoP2.png'

export const Footer = () => {
    return (
        <footer className="w-full bg-dark-charcoal texture-overlay py-16 px-4 md:px-8 lg:px-16 relative">
            {/* Decorative pattern - bottom left */}
            <div className="absolute left-0 bottom-0 w-32 h-full opacity-10 hidden lg:block z-0">
                <div className="w-full h-full bg-gradient-to-r from-black to-transparent">
                    <div className="w-full h-full" style={{
                        backgroundImage: `repeating-linear-gradient(
                            -45deg,
                            transparent,
                            transparent 10px,
                            rgba(0,0,0,0.1) 10px,
                            rgba(0,0,0,0.1) 20px
                        )`,
                    }}></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
                {/* Logo */}
                <div className="mb-8">
                    <Image 
                        src={logo} 
                        alt="Logo p2audio - Produtora de Áudio Profissional" 
                        width={80} 
                        height={80}
                        style={{ height: 'auto' }}
                    />
                </div>

                {/* Phone Number */}


                {/* Copyright */}
                <p className="text-white text-sm md:text-base">
                    © 2025 p2audio - Produtora de Áudio
                </p>
            </div>
        </footer>
    )
}
