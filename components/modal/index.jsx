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
      onCancel: noop,
      offsetLeft: 0
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
  removeStyle(m, style) {
    //删除style;
    if (!m) {
      return false;
    }
    var cArr = style.trim().split(';');
    cArr.map(function (arr) {
      if (arr && arr !== '') {
        var cstyle = '';
        var carr = m.style.cssText.split(';');
        carr.map(function (_arr) {
          if (_arr && _arr !== '') {
            if (!(_arr.split(':')[0].trim().indexOf(arr.split(':')[0].trim()) >= 0 && _arr.split(':')[1].trim() === arr.split(':')[1].trim())) {
              cstyle += _arr ? _arr + ';' : '';
            }
          }
        });
        if (!cstyle || cstyle.replace(/\s/g, '') === '') {
          m.removeAttribute('style');
        } else {
          m.setAttribute('style', cstyle);
        }
      }
    });
  },
  componentDidUpdate() {
    var self = this, dom = self.refs.d.dialogContainer.getElementsByClassName('ant-modal-wrap'), props = self.props;
    var transitionEvent = self.whichTransitionEvent();
    var cdom = dom[0].children;
    var w = 0, h = 0;

    function endTransition() {
      self.removeStyle(this, 'display:block;opacity:0;transform:scale(0);-webkit-transform:scale(0)');
      this.style['transform-origin'] = '';
    }

    for (var i = 0; i < cdom.length; i++) {
      var m = cdom[i];
      if (i !== 0) {
        m.style.transform = 'scale(1)';
        if (!self.offsetLeft) {
          self.offsetLeft = m.offsetLeft;
        }
        if (!self.offsetTop) {
          self.offsetTop = m.getBoundingClientRect().top;
        }
        w = props.x - self.offsetLeft;
        h = props.y - self.offsetTop;
        m.style['transform-origin'] = w + 'px ' + h + 'px';
      }
      m.style.opacity = 0;
      m.style.display = 'block';
      m.addEventListener(transitionEvent, endTransition);
    }
    if (props.visible) {
      setTimeout(()=> {
        EnterAnimation.to(dom, {
          data: [{style: 'alpha'}, {style: 'scale', ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)'}],
          duration: .4
        });
      }, 10);
    } else {
      EnterAnimation.to(dom, {
        data: [{style: 'alpha', duration: 0.5}, {style: 'scale'}],
        direction: 'leave',
        upend: true,
        duration: .4, ease: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)'
      });
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
