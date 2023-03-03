import React, { Component } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

export class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: this.props.initialTitle ? this.props.initialTitle : [],
      suggestions: [
        { id: 'earth', text: 'Earth' },
        { id: 'portrait', text: 'Portrait' },
        { id: 'war', text: 'War' },
        { id: 'mountain', text: 'Mountain' },
        { id: 'tree', text: 'Tree' },
        { id: 'lake', text: 'Lake' },
        { id: 'princess', text: 'Princess' },
        { id: 'sky', text: 'Sky' },
        { id: 'river', text: 'River' },
        { id: 'dog', text: 'Dog' },
        { id: 'wolf', text: 'Wolf' },
        { id: 'forest', text: 'Forest' },
        { id: 'music', text: 'Music' },
        { id: 'sunset', text: 'Sunset' },
        { id: 'king', text: 'King' },
        { id: 'battle', text: 'Battle' },
        { id: 'pond', text: 'Pond' },
        { id: 'flower', text: 'Flower' },
        { id: 'god', text: 'God' },
        { id: 'farm', text: 'Farm' },
        { id: 'horse', text: 'Horse' },
        { id: 'figure', text: 'Figure' },
        { id: 'life', text: 'Life' },
        { id: 'landscape', text: 'Landscape' },
        { id: 'bridge', text: 'Bridge' },
        { id: 'water', text: 'Water' },
        { id: 'day', text: 'Day' },
        { id: 'man', text: 'Man' },
        { id: 'woman', text: 'Woman' },
        { id: 'people', text: 'People' },
        { id: 'family', text: 'Family' },
        { id: 'school', text: 'School' },
        { id: 'country', text: 'Country' },
        { id: 'hand', text: 'Hand' },
        { id: 'night', text: 'Night' },
        { id: 'home', text: 'Home' },
        { id: 'mother', text: 'Mother' },
        { id: 'story', text: 'Story' },
        { id: 'book', text: 'Book' },
        { id: 'house', text: 'House' },
        { id: 'father', text: 'Father' },
        { id: 'game', text: 'Game' },
        { id: 'city', text: 'City' },
        { id: 'body', text: 'Body' },
        { id: 'face', text: 'Face' },
        { id: 'party', text: 'Party' },
        { id: 'morning', text: 'Morning' },
        { id: 'girl', text: 'Girl' },
        { id: 'boy', text: 'Boy' },
        { id: 'sea', text: 'Sea' },
        { id: 'jesus', text: 'Jesus' },
        { id: 'view', text: 'View' },
        { id: 'abstract', text: 'Abstract' },
        { id: 'beach', text: 'Beach' },
        { id: 'nude', text: 'Nude' },
        { id: 'sand', text: 'Sand' },
        { id: 'moon', text: 'Moon' },
        { id: 'autumn', text: 'Autumn' },
        { id: 'spring', text: 'Spring' },
        { id: 'summer', text: 'Summer' },
        { id: 'winter', text: 'Winter' },
        { id: 'bird', text: 'Bird' },
        { id: 'festival', text: 'Festival' },
        { id: 'garden', text: 'Garden' },
        { id: 'son', text: 'Son' },
        { id: 'daughter', text: 'Daughter' },
        { id: 'dance', text: 'Dance' },
        { id: 'roman', text: 'Roman' },
        { id: 'warrior', text: 'Warrior' },
        { id: 'statue', text: 'Statue' },
        { id: 'dream', text: 'Dream' },
        { id: 'fruit', text: 'Fruit' },
        { id: 'wood', text: 'Wood' },
        { id: 'child', text: 'Child' },
        { id: 'christ', text: 'Christ' },
        { id: 'cloud', text: 'Cloud' },
        { id: 'wave', text: 'Wave' },
        { id: 'angel', text: 'Angel' },
        { id: 'scene', text: 'Scene' },
        { id: 'steet', text: 'Street' },
        { id: 'boat', text: 'Boat' },
        { id: 'ship', text: 'Ship' },
        { id: 'window', text: 'Window' },
        { id: 'balcony', text: 'Balcony' },
        { id: 'lady', text: 'Lady' },
        { id: 'saint', text: 'Saint' },
        { id: 'church', text: 'Church' },
        { id: 'ink', text: 'Ink' },
        { id: 'oil', text: 'Oil' },
        { id: 'canvas', text: 'Canvas' },
        { id: 'mourning', text: 'Mourning' },
        { id: 'panel', text: 'Panel' },
        { id: 'scroll', text: 'Scroll' },
        { id: 'rock', text: 'Rock' },
        { id: 'century', text: 'Century' },
        { id: 'light', text: 'Light' },
        { id: 'fire', text: 'Fire' },
        { id: 'magic', text: 'Magic' },
        { id: 'gold', text: 'Gold' },
        { id: 'snow', text: 'Snow' },
        { id: 'stream', text: 'Stream' },
        { id: 'silk', text: 'Silk' },
        { id: 'paint', text: 'Paint' },
        { id: 'black', text: 'Black' },
        { id: 'white', text: 'White' },
        { id: 'dragon', text: 'Dragon' },
        { id: 'wine', text: 'Wine' },
        { id: 'lion', text: 'Lion' },
        { id: 'tiger', text: 'Tiger' },
        { id: 'bear', text: 'Bear' },
        { id: 'cross', text: 'Cross' },
        { id: 'cat', text: 'Cat' },
        { id: 'wild', text: 'Wild' },
        { id: 'wind', text: 'Wind' },
        { id: 'wedding', text: 'Wedding' },
        { id: 'friend', text: 'Friend' },
        { id: 'prince', text: 'Prince' },
        { id: 'death', text: 'Death' },
        { id: 'foot', text: 'Foot' },
        { id: 'birth', text: 'Birth' },
        { id: 'devil', text: 'Devil' },
        { id: 'market', text: 'Market' },
        { id: 'brook', text: 'Brook' },
        { id: 'square', text: 'Square' },
        { id: 'fish', text: 'Fish' },
        { id: 'courtesan', text: 'Courtesan' },
        { id: 'tale', text: 'Tale' },
        { id: 'sketch', text: 'Sketch' },
        { id: 'grave', text: 'Grave' },
        { id: 'train', text: 'Train' },
        { id: 'miracle', text: 'Miracle' },
        { id: 'lamentation', text: 'Lamentation' },
      ],
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
  }

  setTagList() {
    return Array.prototype.map.call(this.state.tags, (t) => t.text).toString()
  }

  componentDidMount() {
    let node = document.querySelector('.ReactTags__tagInputField')
    node.insertAdjacentHTML(
      'afterend',
      '<span class="bottom line"></span><span class="right line"></span><span class="top line"></span><span class="left line"></span>'
    )
  }

  handleDelete(i) {
    const { tags } = this.state
    this.setState(
      {
        tags: tags.filter((tag, index) => index !== i),
      },
      () => {
        this.props.update(this.setTagList())
      }
    )
  }

  handleAddition(tag) {
    this.setState(
      (state) => ({ tags: [...state.tags, tag] }),
      () => {
        this.props.update(this.setTagList())
      }
    )
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags]
    const newTags = tags.slice()
    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)
    this.setState({ tags: newTags })
  }

  render() {
    const { tags, suggestions } = this.state
    return (
      <div>
        {console.log('RRR ||| SEARCH RETURN')}
        <div className="search">
          <ReactTags
            tags={tags}
            suggestions={suggestions}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            handleDrag={this.handleDrag}
            delimiters={delimiters}
            onChange={this.handleAddition}
            autofocus={false}
          />
        </div>
      </div>
    )
  }
}
