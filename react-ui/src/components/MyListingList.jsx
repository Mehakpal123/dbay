import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ListingList from "./ListingList";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import ListingCreate from "./ListingCreate";
import { getListings } from "../database/listing";
import {  getHostStore } from "../database/settings";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function MyListingList() {
  const [expanded, setExpanded] = React.useState(false);
  const [listings, setListings] = useState([]);
  const [store, setStore] = useState({
    storeName: '',
    storeId: ''
  });

  useEffect(() => {
    getHostStore().then((host) => {
      setStore({
        storeName: host.host_store_name,
        storeId: host.host_store_pubkey,
      });
    });
  },[]);

  useEffect(() => {
    if (store) {
      getListings(store.storeId)
        .then((data) => {
          setListings(data);
          console.log(`results: ${data}`);
        })
        .catch((e) => {
          console.error(e);
        });
      return;
    }
  }, [store]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  if (store) {
    return (
      <div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {`${store.storeName}'s Listings`}
          </Typography>
          <ListingList listings={listings} />
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <AddIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <ListingCreate
              storeId={store.storeId} storeName={store.storeName}
            />
          </CardContent>
        </Collapse>
      </div>
    );
  } else {
    return null;
  }
}
export default MyListingList;
