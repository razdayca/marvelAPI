import './charList.scss';
import React, { Component } from 'react';
import MarvelAPI from '../../services/marvelAPI';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';


class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newCharLoading: false,
        offset: 210,
        charEnded: false
    }

    myRef = [];

    marvelService = new MarvelAPI();

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true
        }
        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newCharLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({newCharLoading: true});
    }

    setRef = (ref) => {
        this.myRef.push(ref);
    }

    focusOnItem = (id) => {
        this.myRef.forEach(item => item.classList.remove('char__item_selected'));
        this.myRef[id].classList.add('char__item_selected');
        this.myRef[id].focus();
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    componentDidMount() {
        this.onRequest();
    }

    // componentDidUpdate() {
    //     this.onMyScroll();
    // }

    // onMyScroll = () => {
    //     let scrollHeight = Math.max(
    //         document.body.scrollHeight, document.documentElement.scrollHeight,
    //         document.body.offsetHeight, document.documentElement.offsetHeight,
    //         document.body.clientHeight, document.documentElement.clientHeight
    //   );
    //     window.addEventListener('scroll', () => {
            
    //         if(scrollHeight < scrollHeight - window.pageYOffset) {
    //             this.onRequest()
    //         }
    //         console.log(window.pageYOffset);
    //         console.log('dscjnf jryf' + scrollHeight)
    //     })
    // }

    allChars = (arr) => {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                    <li className="char__item" ref={this.setRef} key={item.id} tabIndex={0} onClick={()=> {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                this.props.onCharSelected(item.id);
                                this.focusOnItem(i);
                            }
                        }}>
                        <img src={item.thumbnail} alt="abyss" style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {charList, loading, error, newCharLoading, offset, charEnded} = this.state;

        const items = this.allChars(charList);

        const spinner = loading ? <Spinner/> : null;
        const view = !(loading || error) ? items : null;
        const errorMessage = error ? <ErrorMessage/> : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {spinner}
                    {view}
                    {errorMessage}
                </ul>
                <button className="button button__main button__long" disabled={newCharLoading} style={{'display': charEnded ? 'none' : null}} onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }   
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;