#!/usr/bin/env bash

echo -e "Setting up github access token to ~/.netrc. Use https://github.com/settings/tokens to generate your access token (add repo scope).";

if [ -z $CI_USER_TOKEN ];
then
  echo -e "use: export CI_USER_TOKEN='ghp_xxxxx' to export your github access token";
else
  if grep -Rq "$CI_USER_TOKEN" ~/.netrc
    then
        echo -e "Private access token already exists."
    else
      if grep -Rq "machine github.com" ~/.netrc
        then
            echo -e "login to github.com machine already added. If it's invalid you may need to add it manually."
        else
            echo -e "machine github.com\n  login $CI_USER_TOKEN" >> ~/.netrc
            echo -e "Private access token was set successfully."
        fi
    fi
fi
