// const Colors = {
//     accentOld: '#e91e63',
//     accent: '#336483',
//     primary: '#3f51b5',
//     primaryDark: '#0f2155',
//     primaryLight: '#c5cae9',
//     primaryText: '#212121',
//     secondaryText: '#757575',
//     background: '#ffffff'
// }

let Colors = {
    accentOld: '#e91e63',
    accent: '#336483',
    black: '#000000',
    primary: '#3f51b5',
    primaryDark: '#003049',
    primaryLight: '#c5cae9',
    primaryText: '#212121',
    secondaryText: '#757575',
    white: '#f1faee',
    background: '#ffffff',
    colorfulAccent: '#c1121f',
    color1: '#1d3557',
    color2: '#457b9d',
    pastelViolet: '#dad8fc',
    pastelGreen: '#DCE8F2',
    pastelOrange: '#FEE3DC',
    pastelOrangeDribble: '#FDE9D4',
    backgroundProfile: '#DCF2EA',
    anotherPeachColor: "#ffb5a7",
}

export function opacity(color: string, opacity: number): string {
    if (opacity < 0 || opacity > 1) return "ERROR"
    const alphaInt: number = Math.round(opacity * 255)
    return color + alphaInt.toString(16).padStart(2, '0')
}

Colors.background = Colors.pastelOrange
Colors.accent = "#000000"
Colors.white = "#FFFFFF"

export default Colors