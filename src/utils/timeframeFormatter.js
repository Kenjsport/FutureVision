export const formatTimeframe = (months, t) => {
    if (months === 0) {
        return t('form.months', { count: 0 });
    } else if (months < 12) {
        return t('form.months', { count: months });
    } else {
        const years = months / 12;
        if (years === 1) {
            return t('form.years', { count: 1 });
        } else {
            return t('form.years_plural', { count: Math.floor(years) });
        }
    }
};

export const formatTimeframeShort = (months, t) => {
    if (months === 0) {
        return '0m';
    } else if (months < 12) {
        return `${months}m`;
    } else {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (remainingMonths === 0) {
            return `${years}y`;
        } else {
            return `${years}y ${remainingMonths}m`;
        }
    }
};

