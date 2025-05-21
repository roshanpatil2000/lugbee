import { colors } from "./color"



export const fonts = {
    thin: 'Montserrat-Thin',
    light: 'Montserrat-Light',//'Roboto-Light',
    regular: 'Montserrat-Regular',//'Roboto-Regular',
    italic: 'Montserrat-Italic',
    medium: 'Montserrat-Medium',//'Roboto-Medium',
    bold: 'Montserrat-Bold',//'Roboto-Bold',
    semiBold: "Montserrat-SemiBold",
};


export const statusBar = {
    dark: 'dark-content',
    light: 'light-content',
    default: 'default'
};


export const flexCenter = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
}

export const primaryColorBackground = {
    flex: 1,
    backgroundColor: colors.primary,
}

export const fontSize = {
    large: 20,
    normal: 14,
    small: 12,
    verySmall: 10,
    medium: 16,
    largeMedium: 18,
    veryLarge: 30
}

export const commonTextStyle = {
    fontSize: fontSize.normal,
    fontFamily: fonts.regular,
    color: colors.black,
    lineHeight: 18
}

export const smallTextSize = {
    fontSize: fontSize.small,
    fontFamily: fonts.regular,
    color: colors.primary
}



export const MediumTextStyle = {
    fontSize: fontSize.medium,
    fontFamily: fonts.medium,
    color: colors.black
}

export const largeMediumStyle = {
    fontSize: fontSize.largeMedium,
    fontFamily: fonts.semiBold,
    color: colors.primary
}

export const LargeTextStyle = {
    fontSize: fontSize.large,
    fontFamily: fonts.medium,
    color: colors.primary,
    // fontWeight: "600"
}


export const HeavyTextStyle = {
    fontSize: fontSize.veryLarge,
    fontFamily: fonts.medium,
    color: colors.black,
    // fontWeight: "600"
}