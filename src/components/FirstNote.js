import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useUser } from "./UserProvider";

export default function FirstNote({ onAddNote }) {
  const { user } = useUser();

  useEffect(() => {
    Swal.fire({
      title: "Welcome to Notes!",
      text: "Click on the plus icon to add your first note!",
      confirmButtonText: "OK",
      showConfirmButton: true,
      showCloseButton: false,
      allowEscapeKey: false,
      background: "#3e1c66",
      color: "#fff",
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
    }).then(() => {
      Swal.fire({
        title: "Give a title to your note first!",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
          placeholder: "Note title",
        },
        confirmButtonText: "Confirm",
        showCancelButton: false,
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: "#fff",
        preConfirm: (title) => {
          if (!title || title.trim() === "") {
            Swal.showValidationMessage("Please enter a valid title");
          }
        },
      }).then((result) => {
        const title = result.value;

        Swal.fire({
          title: "Write your first note!",
          input: "textarea",
          allowEscapeKey: false,
          inputAttributes: {
            autocapitalize: "off",
            placeholder: "Note content",
          },
          confirmButtonText: "Add note",
          showCancelButton: false,
          showLoaderOnConfirm: true,
          allowOutsideClick: false,
          background: "#fff",
          preConfirm: (content) => {
            if (!content || content.trim() === "") {
              Swal.showValidationMessage("Please enter a valid content");
            }
          },
        }).then((result) => {
          const content = result.value;
          const createdAt = new Date().toLocaleString();
          const note = {
            title: title,
            content: content,
            createdAt: createdAt,
            uid: user.uid,
            noteid: 0,
          };
          onAddNote(note);
          Swal.fire({
            title: "Your first note has been added!",
            confirmButtonText: "OK",
            showCancelButton: false,
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: "#fff",
          }).then(() => {
            Swal.fire({
              title: "Click on the note to edit it!",
              confirmButtonText: "OK",
              showCancelButton: false,
              showLoaderOnConfirm: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
              background: "#fff",
            });
          });
        });
      });
    });
  }, [onAddNote, user]);

  return null;
}
