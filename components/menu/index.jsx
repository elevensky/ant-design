import React, {Component} from 'react';
import Menu from 'rc-menu';
import EnterAnimation from '../enter-animation';


class AntMenu extends Component {
  constructor(props) {
    super(props);

    this.EnterData = {
      direction: 'enter',
      upend: false
    };
  }

  setEnterAnimationState() {
    this.EnterData = {
      direction: this.EnterData.direction === 'enter' ? 'leave' : 'enter',
      upend: !this.EnterData.upend
    };
  }

  componentDidMount() {
    this.setEnterAnimationState();
  }

  componentDidUpdate() {
    this.setEnterAnimationState();
  }

  render() {
    return <EnterAnimation duration={0.3} type='scale' interval={0.05} direction={this.EnterData.direction} upend={this.EnterData.upend}>
      <Menu {...this.props} />
    </EnterAnimation>;
  }
}

AntMenu.Item = Menu.Item;
AntMenu.Divider = Menu.Divider;


export default AntMenu;
