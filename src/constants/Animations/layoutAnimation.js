import React from 'react';
import {LayoutAnimation, UIManager, Platform} from 'react-native';

export function layoutAnimation() {
   if (Platform.OS === 'android') {
     UIManager.setLayoutAnimationEnabledExperimental(true);
   }
   LayoutAnimation.configureNext({
     duration: 300,
     create: {
       type: LayoutAnimation.Types.easeIn,
       property: LayoutAnimation.Properties.scaleXY,
       springDamping: 15,
     },
     update: {
       type: LayoutAnimation.Types.spring,
       springDamping: 15,
     },
   });
}
