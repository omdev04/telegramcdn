'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { PlanType } from '@/config/plans';

export interface DashboardUsage {
    storageUsed: number;
    totalImages: number;
    maxImages: number;
}

export interface DashboardContextType {
    plan: PlanType;
    usage: DashboardUsage;
    warnings: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({
    children,
    value,
}: {
    children: ReactNode;
    value: DashboardContextType;
}) {
    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
    return ctx;
}
