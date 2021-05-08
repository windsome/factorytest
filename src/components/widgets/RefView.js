import React, { forwardRef } from 'react';
import { View } from 'react-native';

function FundSelect(props, ref) {
  return <View ref={ref} {...props} />;
}

export default forwardRef(FundSelect);
