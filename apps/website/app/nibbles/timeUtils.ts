export const getDisplayTime = (timeTakenMinutes: number): string => {
    const timeTakenQuotientHours: number = Math.floor(timeTakenMinutes / 60);
    const timeTakenRemainderMinutes: number = timeTakenMinutes % 60;

    if (timeTakenQuotientHours > 0) {
        return `${timeTakenQuotientHours} hours and ${timeTakenRemainderMinutes} minutes`;
    } else {
        return `${timeTakenRemainderMinutes} minutes`
    }
}