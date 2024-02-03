import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118835",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933375",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=494476",
    balance: 0,
  },
];

export default function App(){
const [showAddFriendForm,setShowAddFriendForm]=useState(false)
const[name,setName]=useState('')
const[image,setImageLink]=useState("https://i.pravatar.cc/48")
const [friends,setFriends]=useState(initialFriends)
const[selected,setSelected]=useState(null)
  
  
  function handleAddFriend(friends){

    setFriends(friend=>[...friend,friends]) 
    setShowAddFriendForm(false)

    
  }

  function handleSelection(friend){
    // setSelected(friend)
  setSelected(cur=>cur?.id===friend.id? null:friend)
  setShowAddFriendForm(false)

  }
  function handleSplitBill(value){
     console.log(value)
     setFriends(friends=>friends.map(friend=>friend.id===selected.id?{...friend,balance:friend.balance+value}:friend))
  
    setSelected(null)
    }

  return<div className="app">
    <div className="sidebar">
    <FriendsList name={name} friends={friends} selected={selected} onSlection={handleSelection}/>
    {showAddFriendForm && 
    <FormofAddFriend onHandleAddfriend={handleAddFriend} name={name} onSetName={setName} image={image} onSetimageLink={setImageLink}/>}
    <Button onClick={()=>setShowAddFriendForm(e=>selected? setSelected(null):!e)}>{showAddFriendForm?'close':'Add friend'}
    </Button>
    </div>
    {selected &&
    <FormSplitBill key={selected.id}  onSplitBill={handleSplitBill} select={selected}/>}
  </div>
}

function FriendsList( {friends,onSlection,selected}){
 
  return<ul>
    {friends.map(f=><Friend friend={f} selected={selected} onSlection={onSlection} key={f.id}/>)}
  </ul>
}

function Friend({friend ,onSlection ,selected}){

  return<li className={friend===selected?'selected':""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance<0?
      <p className="red">You owe {friend.name} {Math.abs(friend.balance)}$</p>
      :(friend.balance===0)?
      <p>You and {friend.name} are even</p>
      :<> <p className="green">{friend.name} owe you {friend.balance}$
      </p> 
      </>}
      <Button onClick={(e)=>onSlection(friend)}>{friend===selected?'close':'select'}</Button>
  </li>
}
 
function Button({children,onClick}){
  return<button className='button' onClick={onClick}>{children}</button>
}





function FormofAddFriend({name,onSetName,image,onSetimageLink,onHandleAddfriend}){
    

  function handleSubmit(e){
    e.preventDefault()

    if(!name||!image) return;

    const id=crypto.randomUUID()
    const newFriend={
      id,
      name,
      image:`${image}?=${id}`,
      balance:0,
    
    }
    onSetName('')
    onSetimageLink("https://i.pravatar.cc/48")
    onHandleAddfriend(newFriend)

  }

  return<form className="form-add-friend" onSubmit={handleSubmit}>
        <label>🧑‍🤝‍🧑Friend name:</label>
        <input value={name} type='text' onChange={e=>onSetName(e.target.value)}/>
        <label>🖼️Friend image:</label>
        <input value={image} type='text' onChange={e=>onSetimageLink(e.target.value)}/>
        <Button>add</Button>
       </form>

}
function FormSplitBill({select ,onSplitBill,key}){
  const[bill,setBill]=useState(0)
  const[userExpense,setUserExpense]=useState()
  const[whopay,setWhopay]=useState()
  
  
  const paidbyfriend= bill? bill-userExpense:" "


    

  function handleSplit(e){
    e.preventDefault()
    
    if(!bill||!userExpense) return;
    onSplitBill(whopay==='user' ? paidbyfriend: -paidbyfriend)
 
  }
  

  return(
  <form className="form-split-bill" onSubmit={handleSplit} >
    <h2>Split a bill with {select.name}</h2>
    <label>💵Total bill</label><input type='text' value={bill} onChange={e=>setBill(Number(e.target.value))}/>
    <label>🕴️Your expense</label><input value={userExpense} type='text' onChange={e=>setUserExpense(Number(e.target.value)>bill?userExpense:Number(e.target.value))}/>
    <label>🧑‍🤝‍🧑{select.name} expense</label><input type='text' value={paidbyfriend} disabled/>
    <label>🤑Who is paying?</label>
    <select value={whopay} onChange={e=>setWhopay(e.target.value)}>
      <option value="user">You</option>
      <option value="friend">{select.name}</option>
    </select>
    <Button>Split bill</Button>
  </form>
  )
}
