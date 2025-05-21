// RootNavigation.js
// https://reactnavigation.org/docs/navigating-without-navigation-prop/

import * as React from 'react';
import { StackActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export function push(...args) {
    navigationRef.current?.dispatch(StackActions.push(...args));
    // navigationRef.current?.dispatch(StackActions.push(...args));
}
export function popToTop(...args) {
    navigationRef.current?.dispatch(StackActions.popToTop(...args));
    // navigationRef.current?.dispatch(StackActions.push(...args));
}
export function pop(...args) {
    navigationRef.current?.dispatch(StackActions.pop(...args));
    // navigationRef.current?.dispatch(StackActions.push(...args));
}
export function navigate(...args) {
    navigationRef.current?.navigate(...args);
}
export function goBack(...args) {
    navigationRef.current?.goBack(...args);
}



// add other navigation functions that you need and export them