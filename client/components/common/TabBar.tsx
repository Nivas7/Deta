import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { TabType } from '../../types';
import { globalStyles } from "@/styles";

interface TabBarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
    const tabs: { key: TabType; label: string; icon: string }[] = [
        { key: 'Home', label: 'Home', icon: '🏠' },
        { key: 'History', label: 'History', icon: '📋' },
        { key: 'Analytics', label: 'Analytics', icon: '📊' },
    ];

    return (
        <View style={globalStyles.tabBar}>
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab.key}
                    style={[
                        globalStyles.tabItem,
                        activeTab === tab.key && globalStyles.tabItemActive
                    ]}
                    onPress={() => onTabChange(tab.key)}
                >
                    <Text style={{ fontSize: 20 }}>{tab.icon}</Text>
                    <Text style={[
                        globalStyles.tabText,
                        activeTab === tab.key && globalStyles.tabTextActive
                    ]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};