import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
`;

export const Card = styled.View`
  background-color: #FFFFFF;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
`;

export const UInfoView = styled.View`
    flex-direction: row;
    alignItems: center;
    justify-content: space-between;
`;

export const UDetailView = styled.View`
    flex-direction: row;
    padding: 15px;
`;

export const UImg = styled.Image`
    width: 50px;
    height: 50px;
    border-radius: 25px;
`;

export const UNameAndTimeView = styled.View`
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
`;

export const UName = styled.Text`
    font-size: 14px;
    font-weight: bold;
`;

export const TimeStmp = styled.Text`
    font-size: 12px;
    color: #666;
`;

export const Locality = styled.Text`
    font-size: 10px;
    color: #666;
    font-style: italic;
`;

export const Describe = styled.Text`
    font-size: 14px;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 15px;
`;

export const DesImg = styled.Image`
    width: 100%;
    height: 240px;
`;

export const Line = styled.View`
    width: 100%;
    align-self: center;
    margin-top: 10px;
`;

export const FindSectionView = styled.View`
    flex-direction: row;
    justify-content: center;
    padding: 15px;
`;

export const FindSection = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    margin-right: 25px;
`;

export const FindIcon = styled.Image`
    width: 30px;
    height: 30px;
`;

export const UserSectionView = styled.View`
    flex-direction: row;
    justify-content: center;
    padding: 10px;
`;

export const UserSection = styled.TouchableOpacity`
    flex-direction: row;
    margin-right: 25px;
`;

export const HelpedSection = styled.TouchableOpacity`
    flex-direction: row;
`;

export const UIcon = styled.Image`
    width: 25px;
    height: 25px;
`;

export const HelpedIcon = styled.Image`
    width: 100px;
    height: 50px;
`;
