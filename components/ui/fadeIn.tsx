"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
}

export default function FadeIn({ children, delay = 0 }: FadeInProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
        >
            {children}
        </motion.div>
    );
}