import constants from '../Constants/gameConstants';

const canvasWidth = 450
const gameLostNoticeWidth = canvasWidth * 0.5;
const startGameWidth = canvasWidth * 0.4;

const styles = {
  text: {
    marginTop: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  startGameContainerStyle: {
    width: startGameWidth,
    position: 'absolute',
    left: '50%',
    top: '35%',
    borderRadius: 15,
    zIndex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -startGameWidth*1.05,
    background: 'rgba(0,0,0,0.25)',
  },
  inputForm: {
    
  },
  inputFormLabel: {
    marginTop: -10,
    marginBottom: -10,
  },
  submitNameStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    margin: 10,
    padding: 4,
    width: 140,
    border: '1px solid whitesmoke',
    borderRadius: 10,
  },

  startGameButtonStyle: {
    color: '#1A255C',
    //backgroundColor: 'white',
    fontSize: 14,
    fontWeight: '800',
    margin: 20,
    border: '4px solid white',
    borderRadius: 14
  },
}

export default styles;