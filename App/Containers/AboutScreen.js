// An All Components Screen is a great way to dev and quick-test components
import React from 'react'
import { Platform, View, ScrollView, Text, Image } from 'react-native'
import { Images } from '../Themes'
import styles from './Styles/AboutScreenStyle'


class AboutScreen extends React.Component {

  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionText}>
            1. I have the list of location around 100 location.(Address)
            </Text>
            <Text style={styles.sectionText}>
            2. Each location has some information.
            </Text>
            <Text style={styles.sectionText}>
            3. User can search the location OR
            </Text>
            <Text style={styles.sectionText}>
            4. User can view the nearest Location when they open the map.(must be work on IOS and Android)
            </Text>
            <Text style={styles.sectionText}>
            5. The update could be done with code-push.
            </Text>
            <Text style={styles.subtitle} >
            Hafiz Mohamad
            </Text>
          </View>


        </ScrollView>
      </View>
    )
  }
}

export default AboutScreen
