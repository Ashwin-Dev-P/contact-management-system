import React, { Component } from 'react'

export default class Pagination extends Component {
    constructor(props){
        super(props);

        this.setPageNumber = this.setPageNumber.bind(this);

        this.state = {
            currentPaginationPage: 1
        }
    }

    async componentDidMount(){
        //Calculate total pages
        const totalItems = this.props.totalItems;
        const itemsPerPage = this.props.itemsPerPage;
        var totalPages;

        if( Math.floor(   totalItems / itemsPerPage  ) < (   totalItems / itemsPerPage  ) ){
            totalPages = Math.floor(   totalItems / itemsPerPage  )+1;
        }
        else{
            totalPages = Math.floor(   totalItems / itemsPerPage  );
        }
        
        this.setState({
            totalPages : totalPages
        });
        
    }

    async setPageNumber(value){
       
        var currentPaginationPage = this.state.currentPaginationPage;
        if( !(   (value === 'previous' && currentPaginationPage === 1) ||  ( value === 'next' && currentPaginationPage === this.state.totalPages )  ) ){
            
            if(value === 'previous'){
                currentPaginationPage = currentPaginationPage -1;
            }
            else if(value === 'next'){
                currentPaginationPage = currentPaginationPage + 1;
            }
            else if(value === 'first'){
                currentPaginationPage = 1;
            }else if(value === 'last'){
                currentPaginationPage = this.state.totalPages;
            }
           
            this.setState({
                currentPaginationPage: currentPaginationPage
            });
            
            this.props.setCurrentPage(currentPaginationPage);
            
        }
        
        
    }

    
    render() {
       
        return (
            <div>
                {this.state.currentPaginationPage !== 1 ? 
                <>
                
                <button onClick={ ()=> this.setPageNumber("first") }>First</button>
                </>
                
                :
                <>
                <button onClick={ ()=> this.setPageNumber("first") } disabled>First</button>
                </> 
                }

                {this.state.currentPaginationPage > 1 ? 
                <>
                
                <button onClick={ ()=> this.setPageNumber("previous") } >Previous</button>
                </>
                
                :
                <>
                
                <button onClick={ ()=> this.setPageNumber("previous") } disabled>Previous</button>
                </> 
                }

                
               {this.state.currentPaginationPage}

               
                
               
               {this.state.currentPaginationPage <= this.state.totalPages -1 ? 
                <>
                
                <button onClick={ ()=> this.setPageNumber("next")}>Next</button>
                </>
                
                :
                <>
                <button onClick={ ()=> this.setPageNumber("next")} disabled>Next</button>
                </> 
                }


                {this.state.currentPaginationPage < this.state.totalPages  ? 
                <>
                
                <button onClick={ ()=> this.setPageNumber("last") }>Last</button>
                </>
                
                :
                <>
                <button onClick={ ()=> this.setPageNumber("last") } disabled>Last</button>
                </>
                 }
                
                
            </div>
        )
    }
}
