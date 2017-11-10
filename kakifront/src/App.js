import React, { Component } from 'react';
import './App.css';


/**
* 画像アップ
*/
class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    e.preventDefault();
    var form = new FormData();
    form.append('image',e.target.files[0]);

    console.log(e.target.files[0]);

    fetch('/api/upload', {
      method: "POST",

      body: form
    }).then(
      response => response.json()
    ).then(
      data => {
      this.props.onChange(data.filename);
    });
  }

  render() {
    return (
      <div>
        <input type="file" name="image" onChange={this.handleChange} />
      </div>
    );
  }
}

/**
* 書き込み１件
*/
class Post extends Component {
  render() {
    var image = '';
    if (this.props.post.filename) {
      image = (<img src={`http://localhost:3000/uploads/${this.props.post.filename}`} alt={this.props.post.filename} />);
    }
    return (
      <div className="kakikomi">
        <div>{this.props.post.kakikomi}</div>
        {image}
        <p className="name">{this.props.post.name}</p>
      </div>
    );
  }
}

/**
* 書き込みリスト
*/
class List extends Component {
  // 書き込みリスト
  render() {
    const posts = this.props.posts;
    var list = [];
    for (var i in posts) {
      list.push( <li key={i}><Post post={posts[i]} /></li> );
    }
    return (<ul>{list}</ul>);
  }
}

/**
* 投稿フォーム
*/
class UpForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      kakikomi:'',
      name:'',
      message:'書き込んでください',
      filename: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/v1/Post', {
      method : "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        kakikomi: this.state.kakikomi,
        name : this.state.name,
        filename: this.state.filename
      })
    }).then(data => {
      this.setState({
        message:'アップしました',
        kakikomi: '',
        name: '',
        filename: ''
      });
    }).then(() => {this.props.onSubmit()});
  }

  handleChange = (e) => {
    this.setState({message:''});
    this.setState({ [e.target.name] :e.target.value});
  }

  handleFile = (filename) => {
    console.log(filename);
    this.setState({filename : filename});
  }

  render() {
    return  (
      <div className="form">
        <p>{this.state.message}</p>
        <form onSubmit={this.handleSubmit}>
          <label>内容</label>
          <textarea name="kakikomi" value={this.state.kakikomi} onChange={this.handleChange}></textarea>
          <label>名前</label>
          <input type="text" name="name" value={this.state.name}  onChange={this.handleChange} />
          <button type="submit">投稿</button>
        </form>
        <label>画像</label>
        <ImageUpload onChange={this.handleFile}/>
      </div>
    );
  }
}

/**
* ヘッダー
*/
class Header extends Component {
  render() {
    return (
      <header>
      <h1>掲示板</h1>
      </header>
    );
  }
}

/**
* 全画面
*/
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
    this.updatePosts();

    this.updatePosts = this.updatePosts.bind(this);
  }

  updatePosts(e) {
    getPost((data) => {
      this.setState({posts: data});
    });
  }

  render() {
    // this.updatePosts();
    return (
      <div className="App">
      <Header />
      <UpForm onSubmit={this.updatePosts}/>
      <List posts={this.state.posts}/>
      </div>
    );
  }
}

/**
* サーバーから書き込み一覧を取得する
* @method getPost
* @param  {Function} callback データ取得後のコールバック
* @return {[type]}
*/
function getPost(callback) {
  fetch('/api/v1/Post?sort={"_id":-1}')
  .then(response => response.json())
  .then((data) => {callback(data)});
}

export default App;
