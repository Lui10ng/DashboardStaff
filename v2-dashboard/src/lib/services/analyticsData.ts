export const revenueGoal = {
    current: 4156634,
    target: 10000000,
    get percentage() {
        return Math.round((this.current / this.target) * 100);
    },
    formatCurrency(value: number) {
        return `₱${value.toLocaleString()}`;
    }
};

export const attendeesGoal = {
    current: 2567,
    target: 10000,
    get percentage() {
        return Math.round((this.current / this.target) * 100);
    },
    formatNumber(value: number) {
        return value.toLocaleString();
    }
};

export const statistics = {
    totalRevenue: {
        value: revenueGoal.formatCurrency(revenueGoal.current),
        change: '20.5%',
        goal: revenueGoal
    },
    totalAttendees: {
        value: attendeesGoal.formatNumber(attendeesGoal.current),
        change: '+6.3%',
        goal: attendeesGoal
    },
    totalEvent: {
        value: 6,
        change: '+1 This week'
    },
    totalTicketSold: {
        value: 1264,
        change: '+5.5% This week'
    },
};

export const totalRevenueData = [
    { date: new Date('2025-04-01T16:00:00.000Z'), value: 950 },
    { date: new Date('2025-04-02T16:00:00.000Z'), value: 1100 },
    { date: new Date('2025-04-03T16:00:00.000Z'), value: 850 },
    { date: new Date('2025-04-04T16:00:00.000Z'), value: 1300 },
    { date: new Date('2025-04-05T16:00:00.000Z'), value: 1550 },
    { date: new Date('2025-04-06T16:00:00.000Z'), value: 1400 },
    { date: new Date('2025-04-07T16:00:00.000Z'), value: 1200 },
    { date: new Date('2025-04-08T16:00:00.000Z'), value: 900 },
    { date: new Date('2025-04-09T16:00:00.000Z'), value: 1150 },
    { date: new Date('2025-04-10T16:00:00.000Z'), value: 1000 },
    { date: new Date('2025-04-11T16:00:00.000Z'), value: 1450 },
    { date: new Date('2025-04-12T16:00:00.000Z'), value: 1650 },
    { date: new Date('2025-04-13T16:00:00.000Z'), value: 1500 },
    { date: new Date('2025-04-14T16:00:00.000Z'), value: 1250 },
    { date: new Date('2025-04-15T16:00:00.000Z'), value: 980 },
    { date: new Date('2025-04-16T16:00:00.000Z'), value: 1220 },
    { date: new Date('2025-04-17T16:00:00.000Z'), value: 1050 },
    { date: new Date('2025-04-18T16:00:00.000Z'), value: 1500 },
    { date: new Date('2025-04-19T16:00:00.000Z'), value: 1750 },
    { date: new Date('2025-04-20T16:00:00.000Z'), value: 1600 },
    { date: new Date('2025-04-21T16:00:00.000Z'), value: 875 },
    { date: new Date('2025-04-22T16:00:00.000Z'), value: 1050 },
    { date: new Date('2025-04-23T16:00:00.000Z'), value: 800 },
    { date: new Date('2025-04-24T16:00:00.000Z'), value: 1400 },
    { date: new Date('2025-04-25T16:00:00.000Z'), value: 1700 },
    { date: new Date('2025-04-26T16:00:00.000Z'), value: 1600 },
    { date: new Date('2025-04-27T16:00:00.000Z'), value: 1300 },
    { date: new Date('2025-04-28T16:00:00.000Z'), value: 1000 },
    { date: new Date('2025-04-29T16:00:00.000Z'), value: 1280 },
    { date: new Date('2025-04-30T16:00:00.000Z'), value: 1100 }
];

export const totalEventData = [
    { date: new Date('2025-04-21T16:00:00.000Z'), value: 2 },
    { date: new Date('2025-04-22T16:00:00.000Z'), value: 2 },
    { date: new Date('2025-04-23T16:00:00.000Z'), value: 5 },
    { date: new Date('2025-04-24T16:00:00.000Z'), value: 6 },
    { date: new Date('2025-04-25T16:00:00.000Z'), value: 2 },
    { date: new Date('2025-04-26T16:00:00.000Z'), value: 5 },
    { date: new Date('2025-04-27T16:00:00.000Z'), value: 3 }
];

export const totalTicketSoldData = [
    { date: new Date('2025-04-21T16:00:00.000Z'), value: 1367 },
    { date: new Date('2025-04-22T16:00:00.000Z'), value: 986 },
    { date: new Date('2025-04-23T16:00:00.000Z'), value: 2576 },
    { date: new Date('2025-04-24T16:00:00.000Z'), value: 1237 },
    { date: new Date('2025-04-25T16:00:00.000Z'), value: 1001 },
    { date: new Date('2025-04-26T16:00:00.000Z'), value: 1902 },
    { date: new Date('2025-04-27T16:00:00.000Z'), value: 2145 }
];

export const totalAttendees = [
    { date: new Date('2025-04-21T16:00:00.000Z'), value: 1000 },
    { date: new Date('2025-04-22T16:00:00.000Z'), value: 2100 },
    { date: new Date('2025-04-23T16:00:00.000Z'), value: 2567 },
    { date: new Date('2025-04-24T16:00:00.000Z'), value: 1200 },
    { date: new Date('2025-04-25T16:00:00.000Z'), value: 1100 },
    { date: new Date('2025-04-26T16:00:00.000Z'), value: 1465 },
    { date: new Date('2025-04-27T16:00:00.000Z'), value: 1900 }
];