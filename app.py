
import streamlit as st
import pandas as pd
import plotly.express as px

st.title('AI Data Analytics Platform')

uploaded = st.file_uploader('Upload CSV', type='csv')

if uploaded:
    df = pd.read_csv(uploaded)
    st.subheader('Data Preview')
    st.dataframe(df.head())

    st.subheader('Basic Statistics')
    st.write(df.describe())

    numeric = df.select_dtypes(include='number').columns

    if len(numeric) > 0:
        col = st.selectbox('Select Numeric Column', numeric)
        fig = px.histogram(df, x=col)
        st.plotly_chart(fig)

        avg = df[col].mean()
        st.subheader('AI Insights')
        st.write(f'Average value of {col}: {avg:.2f}')
