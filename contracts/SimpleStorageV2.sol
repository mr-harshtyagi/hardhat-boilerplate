// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract SimpleStorageV2 {
  uint256 favoriteNumber;

  struct People {
    uint256 favoriteNumber;
    string name;
  }
  People[] public people;

  mapping(string => uint256) nameToFavouriteNumber;

  function store(uint256 _favouriteNumber) public {
    favoriteNumber = _favouriteNumber + 1;
  }

  function retrieve() public view returns (uint256) {
    return favoriteNumber;
  }

  function addPerson(string memory _name, uint256 _favouriteNumber) public {
    people.push(People(_favouriteNumber, _name));
    nameToFavouriteNumber[_name] = _favouriteNumber;
  }
}
