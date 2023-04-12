import React from 'react'
import { Card, UInfoView, UDetailView, UImg, UName, UNameAndTimeView, TimeStmp, Locality, Describe, DesImg, Line, FindSectionView, FindSection, FindIcon, UserSectionView, UserSection, UIcon, HelpedSection, HelpedIcon } from '../styled/styled';
import moment from 'moment';
import auth from '@react-native-firebase/auth';

const FlatListt = ({ item, onDelete, onHelp, onNotHelp, onFindVet, onFindPhar, onFindLoc }) => {

  const user = auth().currentUser;

  return (
    <Card>
      <UInfoView>
        <UDetailView>
        <UImg source={{ uri: item.uImg }} />
        <UNameAndTimeView>
          <UName>{item.uName}</UName>      
          <Locality>{item.local}</Locality>
          <TimeStmp>{moment(item.timeStmp.toDate()).fromNow()}</TimeStmp>
        </UNameAndTimeView>
        </UDetailView>
        {item.helped == true ?
        <UDetailView>
        {user.uid == item.userID ?
        <HelpedSection onPress={() => onNotHelp(item.id)}>
        <HelpedIcon source={require('../resou/helped.png')} />
        </HelpedSection>
        : 
        <HelpedSection>
        <HelpedIcon source={require('../resou/helped.png')} />
        </HelpedSection>}
        </UDetailView>
        : null}
      </UInfoView>
      <Describe>{item.describe}</Describe>
      {item.desImg != null ? <DesImg source={{ uri: item.desImg }} /> : <Line />}
      <FindSectionView>
        <FindSection onPress={() => onFindVet(item.id)}>
          <FindIcon source={require('../resou/vet.png')} />
        </FindSection>
        <FindSection onPress={() => onFindPhar(item.id)}>
          <FindIcon source={require('../resou/medicine.png')} />
        </FindSection>
        <FindSection onPress={() => onFindLoc(item.id)}>
          <FindIcon source={require('../resou/navigation.png')} />
        </FindSection>
      </FindSectionView>
      {user.uid == item.userID ?
        <UserSectionView>
          {item.helped == false ?
          <UserSection onPress={() => onHelp(item.id)}>
            <UIcon source={require('../resou/correct.png')} />
          </UserSection>
          : null}
          <UserSection onPress={() => onDelete(item.id)}>
            <UIcon source={require('../resou/delete.png')} />
          </UserSection>
        </UserSectionView>
        : null}
    </Card>
  );
};

export default FlatListt;