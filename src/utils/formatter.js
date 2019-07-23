import numeral from 'numeral'

// load a locale
numeral.register('locale', 'id', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'rb',
        million: 'jt',
        billion: 'm',
        trillion: 't'
    },
    currency: {
        symbol: 'Rp'
    }
});

// switch between locales
numeral.locale('id');

export const currency = (number) => {
    return numeral(number).format('$0,0');
}