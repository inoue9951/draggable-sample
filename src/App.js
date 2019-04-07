import React from 'react';
import Draggable from 'react-draggable';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      selectableContents: props.selectableContents,
      selectedContents: props.selectedContents.map((content, index) => (
        {
          id: content.id,
          name: content.name,
          x: 0,
          y: 0,
          beforeY: 0,
          index: index,
        }
      )),
    };
    this.select = this.select.bind(this);
    this.unSelect = this.unSelect.bind(this);
    this.drag = this.drag.bind(this);
    this.stop = this.stop.bind(this);
  }

  stop() {
    const { selectedContents } = this.state;
    selectedContents.sort((a, b) => {
      return (a.index < b.index) ? -1 : 1;
    });
    this.setState({
      selectedContents: selectedContents.map(content => (
        {
          id: content.id,
          name: content.name,
          x: 0,
          y: 0,
          beforeY: 0,
          index: content.index,
        }
      )),
    });
  }

  drag(e, position) {
    const { selectedContents } = this.state;
    const { y } = position;
    const id = parseInt(position.node.getAttribute('value'), 10);
    const draggingContent = selectedContents.find(
      content => content.id === id
    )
    let index = -1;
    let destination = 0;
    if (draggingContent.index > 0 && y < draggingContent.beforeY) {
      // 上に動かした時の処理
      index = draggingContent.index - 1;
      destination = 55;
    } else if (draggingContent.index < selectedContents.length - 1 && y > draggingContent.beforeY) {
      // 下に動かした時の処理
      index = draggingContent.index + 1;
      destination = -55
    }
    if (index >= 0) {
      const draggingIndex = selectedContents.findIndex(content => content.id === draggingContent.id);
      const movedContentIndex = selectedContents.findIndex(content => content.index === index);
      // 動かされるコンテンツ内容の変更
      selectedContents[movedContentIndex].index = draggingContent.index;
      selectedContents[movedContentIndex].y += destination;
      // 動かしているコンテンツ内容の変更
      selectedContents[draggingIndex].index = index;
      selectedContents[draggingIndex].beforeY = y;
      this.setState({
        selectedContents,
      })
    }
  }

  select(e) {
    const id = e.target.value;
    const { selectableContents, selectedContents } = this.state;
    const index = selectableContents.findIndex(
      content => content.id === parseInt(id, 10)
    )
    const selectContent = selectableContents[index];
    selectedContents.push({
      id: selectContent.id,
      name: selectContent.name,
      x: 0,
      y: 0,
      index: selectedContents.length,
    });
    selectableContents.splice(index, 1);
    this.setState({
      selectableContents,
      selectedContents,
    });
  }

  unSelect(e) {
    const id = e.target.value;
    const { selectableContents, selectedContents } = this.state;
    const index = selectedContents.findIndex(
      content => content.id === parseInt(id, 10)
    )
    selectableContents.push(selectedContents[index]);
    selectedContents.splice(index, 1);
    this.setState({
      selectableContents,
      selectedContents: selectedContents.map((content, index) => (
        {
          id: content.id,
          name: content.name,
          x: 0,
          y: 0,
          index: index,
        }
      )),
    });
  }

  selectableItems() {
    const { selectableContents } = this.state;
    return selectableContents.map(content => 
      <button 
        type="butotn" 
        value={content.id}
        className="btn"
        onClick={this.select}
        key={content.id}
      >
        {content.name}
      </button>
    )
  }

  draggableItems() {
    const { selectedContents } = this.state;
    return selectedContents.map(content =>
      <Draggable
        axis="y"
        grid={[55, 55]}
        handle=".nameArea"
        cancel="button"
        key={content.id}
        position={{x: content.x, y: content.y}}
        onDrag={this.drag}
        onStop={this.stop}
      >
        <div className="draggable" value={content.id}>
          <div className="nameArea">
            <p>{content.name}</p>
          </div>
          <div>
            <button 
              className="unSelect"
              type="button"
              value={content.id}
              onClick={this.unSelect}
            >
              ×
            </button>
          </div>
        </div>
      </Draggable>
    )
  }

  render() {
    const selectableItems = this.selectableItems();
    const draggableItems = this.draggableItems();
    return (
      <div className="main">
        <div className="selectableArea">
          {selectableItems}
        </div>
        <div className="selectedArea">
          {draggableItems}
        </div>
      </div>
    );
  }
}