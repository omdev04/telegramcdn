'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { TelegramLoginButton } from './TelegramLoginButton';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export const LoginView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedTos, setAcceptedTos] = useState(false);
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    // You can set this in env NEXT_PUBLIC_TELEGRAM_BOT_NAME
    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'samplebot';

    const handleGoogleLogin = async () => {
        if (!acceptedTos) {
            showToast('Please accept Terms & Conditions and Privacy Policy to continue', 'error');
            return;
        }
        setIsLoading(true);
        await signIn('google', { callbackUrl: '/dashboard' });
    }; 

    const handleTelegramAuth = async (user: any) => {
        setIsLoading(true);
        await signIn('telegram-login', {
            ...user,
            callbackUrl: '/dashboard',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[420px] p-8 rounded-[32px] glass-panel shadow-2xl relative z-10 border border-white/5"
        >
            <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 rounded-2xl flex items-center justify-center p-3">
                        <Image src="/logo/only_logo_icon.png" alt="Imgnest Logo" width={64} height={64} className="object-contain" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-white font-display mb-3 tracking-tight">
                    Welcome Back
                </h2>
                <p className="text-gray-400 text-[15px] leading-relaxed">
                    Sign in to access your secure image library
                </p>
                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-left">
                        <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                        <span className="text-sm text-red-200">{decodeURIComponent(error)}</span>
                    </div>
                )}
            </div>

            <div className="space-y-5">
                {/* Google Login */}
                <Button
                    onClick={handleGoogleLogin}
                    isLoading={isLoading}
                    disabled={!acceptedTos || isLoading}
                    title={!acceptedTos ? 'Accept Terms & Privacy to continue' : undefined}
                    variant="secondary"
                    className="w-full h-12 bg-white text-black hover:bg-gray-100 font-semibold rounded-2xl text-[15px] transition-all hover:scale-[1.02] shadow-lg shadow-white/5"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-3" alt="Google" />
                    Continue with Google
                </Button>

                {!acceptedTos && (
                    <div className="mt-2 text-sm text-red-300 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>Please accept the Terms & Conditions and Privacy Policy to enable sign-in.</span>
                    </div>
                )}

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase tracking-widest font-bold">
                        <span className="bg-[#050714] px-4 text-gray-600"></span>
                    </div>
                </div>

                {/* Terms acceptance */}
                <div className="mt-3 flex items-start gap-3">
                    <input
                        id="accept-tos"
                        type="checkbox"
                        checked={acceptedTos}
                        onChange={() => setAcceptedTos(!acceptedTos)}
                        className="h-4 w-4 rounded bg-black border border-white/10 mt-1"
                    />
                    <label htmlFor="accept-tos" className="text-sm text-gray-300 leading-relaxed">
                        I agree to the Imgnest <Link href="/terms" className="underline hover:text-cyan-400">Terms & Conditions</Link> and <Link href="/privacy" className="underline hover:text-cyan-400">Privacy Policy</Link>.
                    </label>
                </div>

                {/* Telegram Widget (gated behind acceptance to avoid loading scripts) */}
                {/* {acceptedTos ? (
                    // <div className="flex flex-col items-center justify-center bg-[#29a9ea]/10 border border-[#29a9ea]/20 rounded-2xl p-4 transition-all hover:bg-[#29a9ea]/15">
                    //     <TelegramLoginButton botName={botName} onAuth={handleTelegramAuth} />
                    // </div>
                ) : (
                    <div className="flex flex-col items-center justify-center bg-[#1a1b1f] border border-[#242628] rounded-2xl p-4">
                        <div className="text-sm text-gray-500">Please accept the Terms & Conditions and Privacy Policy to continue with Telegram sign-in.</div>
                    </div>
                )} */}
            </div>
        </motion.div>
    );
};
