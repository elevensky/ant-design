import React from 'react';
import Dialog from 'rc-dialog';
import EnterAnimation from '../enter-animation';
function noop() {
}

export default React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false
    };
  },

  handleCancel() {
    var d = this.refs.d;
    d.requestClose();
  },

  getDefaultProps() {
    return {
      prefixCls: 'ant-modal',
      onOk: noop,
      onCancel: noop
    };
  },

  handleOk() {
    this.setState({
      confirmLoading: true
    });
    if (typeof this.props.onOk === 'function') {
      this.props.onOk();
    }
  },
  whichTransitionEvent() {
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (var t in transitions) {
      if (t in document.documentElement.style) {
        return transitions[t];
      }
    }
    return false;
  },
  removeStyle(m, style, oneBool) {
    //删除style;
    if (!m) {
      return false;
    }
    var cArr = style.trim().split(';');
    cArr.map(function (arr) {
      if (arr && arr !== '') {
        var carr = m.style.cssText.split(';'),
          cOne = arr.split(':')[0].replace(/\s/g, ''),
          cTow = arr.split(':')[1] ? arr.split(':')[1].replace(/\s/g, '') : '';
        carr.map(function (_arr) {
          if (_arr && _arr !== '') {
            var tcOne = _arr.split(':')[0].replace(/\s/g, ''),
              tcTow = _arr.split(':')[1].replace(/\s/g, '');
            if (oneBool && tcOne.indexOf(cOne) >= 0) {
              m.style[arr.split(':')[0]] = '';
            } else if (tcOne.indexOf(cOne) >= 0 && tcTow === cTow) {
              m.style[arr.split(':')[0]] = '';
            }
          }
        });
      }
    });
  },
  componentDidUpdate() {
    var self = this, dom = self.refs.d.dialogContainer.getElementsByClassName('ant-modal-wrap'), props = self.props, i = 0;
    var transitionEvent = self.whichTransitionEvent();
    var cdom = dom[0].children;
    var w = 0, h = 0;

    function endTransition() {
      this.removeEventListener(transitionEvent, endTransition);
      self.removeStyle(this, 'display;opacity;transform;transform-origin', true);
    }

    if (!!self.props.visible !== !!self.openBool) {
      for (i = 0; i < cdom.length; i++) {
        var m = cdom[i];
        if (i !== 0) {
          w = props.clientX - m.offsetLeft || 'center';
          h = props.clientY - m.getBoundingClientRect().top || 'center';
          m.style['transform-origin'] = w + 'px ' + h + 'px';
        }
        m.style.opacity = 0;
        m.style.display = 'block';
        m.addEventListener(transitionEvent, endTransition);
      }


      if (props.visible) {
        setTimeout(()=> {
          for (i = 0; i < cdom.length; i++) {
            var mm = cdom[i];
            if (i !== 0) {
              w = props.clientX - mm.offsetLeft || 'center';
              h = props.clientY - mm.getBoundingClientRect().top || 'center';
              mm.style['transform-origin'] = w + 'px ' + h + 'px';
            }
          }
          EnterAnimation.to(dom, {
            data: [{type: 'alpha'}, {type: 'scale', ease: 'cubic-bezier(0.075, 0.82, 0.165, 1)'}],
            duration: .3,
            hidden: false,
            delay: 0.02
          });
        }, 10);
      } else {
        EnterAnimation.to(dom, {
          data: [{type: 'alpha', ease: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'}, {type: 'scale'}],
          direction: 'leave',
          upend: true,
          duration: .3,
          ease: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
          hidden: false
        });
      }
      self.openBool = !self.openBool;
    }

  },
  componentWillReceiveProps(nextProps) {
    if ('visible' in nextProps) {
      // 隐藏后去除按钮 loading 效果
      if (!nextProps.visible) {
        this.setState({
          confirmLoading: false
        });
      }
    }
  },

  render() {
    var loadingIcon = this.state.confirmLoading ?
      <i className="anticon anticon-loading"></i> : '';
    var props = this.props;
    var footer = props.footer || [
        <button key="cancel" type="button" className="ant-btn ant-btn-lg" onClick={this.handleCancel}>取 消</button>,
        <button key="confirm" type="button" className="ant-btn ant-btn-primary ant-btn-lg" onClick={this.handleOk}>
          确 定 {loadingIcon}
        </button>
      ];
    return <Dialog onBeforeClose={props.onCancel} visible={this.state.visible} width="500" footer={footer} {...props} ref="d" />;
  }
});
