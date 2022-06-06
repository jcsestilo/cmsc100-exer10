import React from 'react';

export default class Header extends React.Component{
    render(){

        const firstName = this.props.firstName;

        return(
            <div>
                Welcome, {firstName}!
                <a href='#'>Search</a>

            </div>
        );
    }
}