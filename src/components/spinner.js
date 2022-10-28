

export default function Spinner() {

    return (
        <div className="d-flex justify-content-center" style={{paddingTop:"50%"}}>
            <div className="spinner-border spinner-border-sm" role="status">
                
            </div>
            <h6 className="sr-only" style={{marginLeft:"10px"}}>Loading...</h6>
        </div>
    )
}