import { Dimensions, PixelRatio } from 'react-native';

export let screenWidth = Dimensions.get('window').width;
export let screenHeight = Dimensions.get('window').height;

// width
const wpx = widthPercent => {
    const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
}

// hight
const hpx = heightPercent => {
    const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
}

const listenOrientationChange = that => {
    Dimensions.addEventListener('change', newDimensions => {

        screenWidth = newDimensions.window.width;
        screenHeight = newDimensions.window.height;
        that.setState({
            orientation: screenWidth < screenHeight ? 'portrait' : 'landscape'
        });
    });
};


const removeOrientationListener = () => {
    Dimensions.removeEventListener('change', () => { });
};

export {
    wpx,
    hpx,
    listenOrientationChange,
    removeOrientationListener
};