

const monthToSeasonMap = [
    'Winter',
    'Winter',
    'Spring',
    'Spring',
    'Spring',
    'Summer',
    'Summer',
    'Summer',
    'Fall',
    'Fall',
    'Fall',
    'Winter'
]

export function mapToSeason(month: number) {
    return monthToSeasonMap[month - 1];
}