export class DateFormatter {
    static formatToBrazilianDate(date: Date): string {
        return Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            
        }).format(date);
    }
}