"use client";

import { Award, Crown, ExternalLink, Trophy } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import Link from "next/link"

export const PodiumCard = ({ student, rank, isCenter }: any) => {
    const router = useRouter();
    if (!student) return null;

    // 🎨 Color logic (ONLY using your theme vars)
    const ringColor =
        rank === 1
            ? "shadow-[0_0_25px_var(--chart-1)]"
            : rank === 2
                ? "shadow-[0_0_25px_var(--chart-2)]"
                : "shadow-[0_0_25px_var(--chart-5)]";

    const borderColor =
        rank === 1
            ? "border-[color:var(--chart-1)]"
            : rank === 2
                ? "border-[color:var(--chart-2)]"
                : "border-[color:var(--chart-5)]";
    const textColor =
        rank === 1
            ? "text-[color:var(--chart-1)]"
            : rank === 2
                ? "text-[color:var(--chart-2)]"
                : "text-[color:var(--chart-5)]";
    const badgeColor =
        rank === 1
            ? "bg-[color:var(--chart-1)] text-black"
            : rank === 2
                ? "bg-[color:var(--chart-2)] text-black"
                : "bg-[color:var(--chart-5)] text-black";
    const bgColor =
        rank === 1
            ? "bg-[color:var(--chart-1)/10]"
            : rank === 2
                ? "bg-[color:var(--chart-2)/10]"
                : "bg-[color:var(--chart-5)/10]";

    return (
        <motion.div
            drag
            dragElastic={0.4}
            dragMomentum={false}
            whileDrag={{ scale: 1.08, rotate: isCenter ? 3 : -3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
            className={`
        relative group cursor-grab active:cursor-grabbing
        ${isCenter ? "scale-110 z-20" : "scale-95 opacity-80 z-20"}
      `}
        >

            {/* 💎 Card */}

            <div
                className={`relative glass rounded-3xl px-8 py-10 w-[230px] md:w-[260px] text-center border ${borderColor} shadow-xl backdrop-blur-xl`}
            >

                {/* 👑 Crown */}
                {rank == 1 && (
                    <Trophy className="absolute -top-1 left-1/2 -translate-x-1/2 text-[color:var(--chart-1)] w-10 h-10 crown-float" />
                )}

                {rank == 2 && (
                    <Award className="absolute -top-1 left-1/2 -translate-x-1/2 text-[color:var(--chart-2)] w-10 h-10 crown-float" />
                )}


                {rank == 3 && (
                    <Award className="absolute -top-1 left-1/2 -translate-x-1/2 text-[color:var(--chart-5)] w-10 h-10 crown-float" />
                )}

                {/* Avatar */}
                <div className="relative mb-5 flex justify-center">
                    <div className="relative">

                        {/* Subtle glow ring */}
                        <div
                            className={`absolute inset-0 rounded-full blur-md opacity-70 ${ringColor}`}
                        />

                        {/* Avatar */}
                        <div
                            className={`relative w-44 h-44 rounded-full border-2 ${borderColor} bg-card overflow-hidden flex items-center justify-center`}
                        >
                            {student?.profile_image_url ? (
                                <Image
                                    src={student.profile_image_url}
                                    alt={student.name || "profile"}
                                    fill
                                    quality={100}
                                    sizes="96px"
                                    draggable={false}
                                    className="object-cover group-hover:scale-110 transition duration-500"
                                    unoptimized
                                />
                            ) : (
                                <ProfileAvatar username={student?.username || ""} bgcolor={
                                    rank === 1 ? "var(--chart-1)" :
                                        rank === 2 ? "var(--chart-2)" :
                                            "var(--chart-5)"
                                }
                                    size={173} />
                            )}
                        </div>

                        {/* Rank Badge */}
                        <div
                            className={`absolute bottom-2 right-0 text-lg px-4 py-2 rounded-2xl font-bold shadow-md ${badgeColor}`}
                        >
                            {rank}
                        </div>
                    </div>
                </div>

                {/* Name */}
                <h3 className="font-bold text-2xl truncate">
                    {student.name}
                </h3>

                {/* Username */}

                <p className={`text-xs ${textColor} truncate flex justify-center`}>
                    <Link
                        href={`/profile/${student?.username}`}
                        className="flex items-center gap-1"
                    >
                        <span>@{student.username}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </p>

                {/* Location */}
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {student.city_name || "PW IOI"}
                </p>

                {/* Score */}
                <div className={`mt-5 rounded-2xl border border-border py-4   ${bgColor}  `}   >
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Score
                    </p>
                    <p
                        className={`${textColor} text-3xl font-black`}
                    >
                        {student.score}
                    </p>
                </div>
            </div>

        </motion.div >
    );
};