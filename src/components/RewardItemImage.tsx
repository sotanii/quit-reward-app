import React, { useState } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';

type Props = {
  imageUrl?: string;
  style?: StyleProp<ImageStyle>;
};

export function RewardItemImage({ imageUrl, style }: Props) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl?.trim() || failed) {
    return null;
  }

  return (
    <Image
      source={{ uri: imageUrl.trim() }}
      style={[styles.image, style]}
      onError={() => setFailed(true)}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#ECECEC',
  },
});
